
--TO DO 
--Have included GroupId in TaskNode and TaskAssignment to allow for workflows where a given step is assigned to multiple groups 
--Consider merging TaskAssignment and TaskNode 

--START INITIALISATION OF WORKFLOW
--Set up a Sequential task as if logged in as Peter (userId 1, Creator Group 1)
--ApproveProcessId = 3
--Question - if I belong to multiple groups, how to know which one to use as the "master" group ID
--Will just have to do an "IN" and use them all if necessary
--Might need to ponder an override option?

Select StartNodeId from ApprovalProcessTypes where ApprovalProcessId = '3'   -- 3,4,5,6  Sequential, Hierarchical, Voting, Unanimous
--1
insert into Task(DateUpdated, Status, RaiserUserId, ApprovalProcessType) values(getdate(), 'I', 1, 3)
select * from TASK where DateUpdated > dateadd(d, -1, getdate())
--Task Id = 1 (not got a group yet)
select BranchNode.RelationTypeId, BranchNode.AccessType from BranchNode where 
NodeId = 1
and Type='Start'

--1, 1
--For each node returned get relation
select RelativeGroupId from GroupRoleRelation where 
	ApprovalProcessId = 3 AND
	MasterGroupId IN (1) AND -- My group
	RelationTypeId  = 1   --From BrachNode

--2
--Access Type still 1, NodeId still 1
--Iterative in code for each group
	insert into TaskAssignment (TaskId, DateAssigned, GroupId, AccessType, NodeId) 
								VALUES(1, getdate(), 2, 1, 1)
	insert into TaskNode(TaskId, NodeId, DateUpdated, GroupId) values(1, 1, GETDATE(), 2)
--End Iteration

--END INITIALISATION OF WORKFLOW

--APPROVAL LEVEL 1
--Hard coded "Closed" Status into the Task Status - might want to ponder that.

--Someone in the Level 1 approvers group (Person IDs 2,3, 13)

--Get ApprovalProcessId ( Type)
select ApprovalProcessType from Task where TaskId = 1
--3
--getUserGroup
select GroupId from UserGroup where personId = 13
--2
--GetTaskAssignment
Select A.TaskId, A.AccessType, A.GroupId 
from TaskAssignment A Join Task T 
on T.TaskId = A.TaskId 
and 	Status <> 		'Closed'  
	where  GroupId in (2)
--1
--getNodeId
Select NodeId from TaskNode where TaskId = 1 and GroupId = 2 
--1

--getOutput
select OutputNodeId, ConditionTest, ConditionDescription, 	RelationTypeId, Type, AccessType 
from BranchNode B
join 
BranchCondition C on B.ConditionId =  C.ConditionId 
Where NodeId IN
(
select OutputNodeId from BranchNode where NodeId = 1
)

--9	Success	Submission Success	1	FirstApprovalNode	1
--7	Reject	Rejection	0	End-Rejected	1

--getRelativeGroupId
--Work backwards to original user to determine what relation we have to them
--From the above output nodes we have RelationTypeId = 1 (Approve).  We are approver.  
--So identify which of the groups to which we belong is the one 
--that gives us our approver role
select relativeGroupId from GroupRoleRelation where RelationTypeId = 1 and 
RelativeGroupId In 
(select GroupId from UserGroup where personId = 13)
and 
MasterGroupId In 
(select GroupId from UserGroup where personId = (select raiserUserId from Task where taskId = 1))
and ApprovalProcessId = 3

--2  (i.e. we, the appover, are in Group 2 and that is the group that was assigned the task)

--Assume it was "approved" (this is from matching Condition Test that we got from the BranchNode query above
--9	Success	Submission Success	1	FirstApprovalNode	1
--That means the branch is the one with values 9	Success	Submission Success	1	FirstApprovalNode	1
--i.e. Node Id 9

delete from TaskAssignment where taskId = 1 and GroupId = 2
delete from taskNode where taskId = 1 and NodeId = 1 and groupid = 2

--delete from TaskAssignmentHistory 

insert 
into 
TaskAssignmentHistory (TaskId,GroupId,NodeId,DateUpdated,Outcome, ApproverId, ConditionTest) 
values(1, 2, 9, getdate(), 'Sucess', 13, 'Success')

--The node which passed the test is Node 9, find the next node and how to get there (i.e. relationship)
--Need to add a "nodetype" flag to indicate if they are decision nodes or state nodes

select OutputNodeId, ConditionTest, ConditionDescription, 	RelationTypeId, Type, AccessType 
from BranchNode B
join 
BranchCondition C on B.ConditionId =  C.ConditionId 
Where NodeId = 9

--10	Null	No Test	1	IntermediateResult	1

--Find the group related to the current group (which was 2) via relationship 1 (approvers) for the sequential approval process

select RelativeGroupId from GroupRoleRelation where 
	ApprovalProcessId = 3 AND
	MasterGroupId = 2 AND 
	RelationTypeId  = 1

--3

--Assign to that group
--Iterative for each approval group
	insert into TaskAssignment (TaskId, DateAssigned, GroupId, AccessType, NodeId) 
							VALUES(1, getdate(), 3, 1, 9)
	insert into TaskNode (TaskId, NodeId, DateUpdated, Groupid) Values(1, 9, getdate(), 3)  --Updated Task Node to 9
--End Iteration
update task set DateUpdated = getdate() where taskId = 1



--END APPROVAL LEVEL 1

--START APPROVAL LEVEL 2 (and end)

--Pretend to be someone in the Level 2 approvers group (Person IDs 4, 14)

select GroupId from UserGroup where personId = 14
--3
Select A.TaskId, A.AccessType, A.GroupId 
from TaskAssignment A Join Task T 
on T.TaskId = A.TaskId 
and 	Status <> 		'Closed'  
	where  GroupId in (3)
--1, 1, 3

Select NodeId from TaskNode where TaskId = 1
--9

--Get the outputs from the Intermediate Approval Node


select OutputNodeId, ConditionTest, ConditionDescription, 	RelationTypeId, Type, AccessType 
from BranchNode B
join 
BranchCondition C on B.ConditionId =  C.ConditionId 
Where NodeId IN
(
select OutputNodeId from BranchNode where NodeId = 9
)

--6	Success	Submission Success	0	IntermediateApproval	1
--7	Reject	Rejection	0	IntermediateApproval	1

--Work backwards to approver of previous node (note, in some workflows there may be more than one!) to determine what relation we have to them
--RelationTypeId = 1 (Approve).  We are approver.  So identify which of the groups to which we belong is the one 
--that gives us our approver role

select relativeGroupId from GroupRoleRelation where RelationTypeId = 1 and 
RelativeGroupId In 
(select GroupId from UserGroup where personId = 14)
and 
MasterGroupId In 
(select GroupId from UserGroup where personId IN 
	(
		select ApproverId from TaskAssignmentHistory where taskId = 1 and NodeId = 9 --(and ConditionTest = 'Success') -- Conditions can be identified if necessary to filter down previous node
	)
)
and ApprovalProcessId = 3

--3  (i.e. we, the appover, are in Group 3 and that is the group that was assigned the task)

--Assume it was "approved"
--That means the branch is the one with values 6	Success	Submission Success	0	IntermediateApproval	1
--i.e. Node Id 6

delete from TaskAssignment where taskId = 1 and GroupId = 3
delete from taskNode where taskId = 1 and NodeId = 9

insert into TaskNode (TaskId, NodeId, DateUpdated, GroupId) Values(1, 6, getdate(), 3)  --Updated Task Node to 6
update task set DateUpdated = getdate() where taskId = 1


insert 
into 
TaskAssignmentHistory (TaskId,GroupId,NodeId,DateUpdated,Outcome, ApproverId, ConditionTest) 
values(1, 3, 9, getdate(), 'Sucess', 14, 'Success')

--The node which passed the test is Node 6, find the next node and how to get there (i.e. relationship)
--Need to add a "nodetype" flag to indicate if they are decision nodes or state nodes

select OutputNodeId, ConditionTest, ConditionDescription, 	RelationTypeId, Type, AccessType 
from BranchNode B
join 
BranchCondition C on B.ConditionId =  C.ConditionId 
Where NodeId = 6


--NULL	Null	No Test	4	EndSuccessRedirecttoStart	1


--END OF WORKFLOW!

--#################################################################


--START INITIALISATION OF Unanimous WORKFLOW
--Set up a Unanimous task as if logged in as Peter (userId 1, Creator Group 1)
--ApproveProcessId = 6
--
Select StartNodeId from ApprovalProcessTypes where ApprovalProcessId = '6'   -- ProcessId = 3,4,5,6  Sequential, Hierarchical, Voting, Unanimous
--4
insert into Task(DateUpdated, Status, RaiserUserId, ApprovalProcessType) values(getdate(), 'I', 1, 6)
select * from TASK where DateUpdated > dateadd(d, -1, getdate())
--Task Id = 2 (not got a group yet)
select BranchNode.RelationTypeId, BranchNode.AccessType from BranchNode where 
NodeId = 4
and Type='Start'

--1, 1


--For each row returned get relation
select RelativeGroupId from GroupRoleRelation where 
	ApprovalProcessId = 6 AND
	MasterGroupId = 1 AND 
	RelationTypeId  = 1
	
--4
--Access Type still 1, NodeId still 1
--Iterative in code for each group 
--(As this is ApprovalProcessId of 6, all members of the group must approve
-- Interesting question here is what if the membership of the group changes?
-- Not totally solvable 
-- Too messy to add an assignment per person - if someone is added that could trigger an extra row but if someone leaves do we delete their row?
-- Other option to have assignment at group level and then trying to check the members in real time is better but
-- also problematic, e.g. someone left the group after approving means we have a record of them but they don't count to the total so we have to do a check
-- against the memebrs of the group at the moment and ensure there is a TaskAssignmentHistory for each one of them
-- (the idea is for all members of the group to approve)
-- (by "the group" of course, we mean each group to which a task has been assigned - but to keep it simple for the demo we just have one group with multiple people)
-- this will insert one row in Task Assignment 

	insert into TaskAssignment (TaskId, DateAssigned, GroupId, AccessType, NodeId) 
								VALUES(2, getdate(), 4, 1, 4)
	insert into TaskNode values(2, 4, GETDATE(), 4)
--End Iteration

--Select * from TaskNode

--END INITIALISATION OF WORKFLOW

--Approval by First person in Group

--Someone in the uni-approvers group (Person IDs 10,11,12)  --Note at this point not run through if they are in multiple groups

select GroupId from UserGroup where personId = 10
--4
Select A.TaskId, A.AccessType, A.GroupId 
from TaskAssignment A Join Task T 
on T.TaskId = A.TaskId 
and 	Status <> 		'Closed'  
	where  GroupId in (4)
--2, 1, 4

Select NodeId from TaskNode where TaskId = 2 and GroupId = 4 
--4  (could have more than one node ... just repeat the whole of the below)

select OutputNodeId, ConditionTest, ConditionDescription, 	RelationTypeId, Type, AccessType 
from BranchNode B
join 
BranchCondition C on B.ConditionId =  C.ConditionId 
Where NodeId IN
(
select OutputNodeId from BranchNode where NodeId = 4
)

--16	Success	Submission Success	0	End-Approved	NULL
--17	Reject	Rejection	0	End-Rejected	NULL

--Work backwards to original user to determine what relation we have to them
--RelationTypeId = 1 (Approve).  We are approver.  So identify which of the groups to which we belong is the one 
--that gives us our approver role
select relativeGroupId from GroupRoleRelation where RelationTypeId = 1 and 
RelativeGroupId In 
(select GroupId from UserGroup where personId = 10)
and 
MasterGroupId In 
(select GroupId from UserGroup where personId = (select raiserUserId from Task where taskId = 2))
and ApprovalProcessId = 6

--4  (i.e. we, the appover, are in Group 4 and that is the group that was assigned the task)

--A "rejection" in unanimous workflow means immediate cessation of the workflow so if the branch is
--17	Reject	Rejection	0	End-Rejected	NULL
--we'd have to delete all TaskNodes and TaskAssignments (after writing the rejection to TaskAssignmentHistory)

--Assume it was "approved" 
--That means the branch is the one with values  16	Success	Submission Success	0	End-Approved	NULL
--i.e. Node Id 16

--Record the approval
insert 
into 
TaskAssignmentHistory (TaskId,GroupId,NodeId,DateUpdated,Outcome, ApproverId, ConditionTest) 
values(2, 4, 4, getdate(), 'Success', 10, 'Success')

--Check for Unanimity

	--Check if there are other approvers outstanding for the user's group
	--Bear in mind the comment above about people coming into and out of the group

	select count(1) from TaskAssignmentHistory where 
	TaskId = 2
	and
	GroupId = 4
	and ApproverId in (Select PersonId from UserGroup where GroupId = 4 and UserGroup.EndDate is null and (Enabled = 1 or Enabled is null))
	and ConditionTest = 'Success'

	select count (PersonId) 
	from UserGroup 
	where GroupId = 4 
	and UserGroup.EndDate is null and (Enabled = 1 or Enabled is null)

	--Compare the two counts and if they don't match, keep task open

	--But if all have approved, remove this assignment *for this group only*
	delete from TaskAssignment where taskId = 2 and GroupId = 4 and NodeId = 4

--Next check to see if there are other groups to which this task is also assigned  (as the relationship can be to multiple groups, potentially)
--in order to prevent deletion of the TaskNode before everyone has approved

	select groupId from TaskAssignment where 
	TaskId = 2
	and Groupid <> 4
--For each Group (gid)
		select count(1) from TaskAssignmentHistory where 
		TaskId = 2
		and GroupId = Gid 
		and ApproverId in (Select PersonId from UserGroup where GroupId = GId and UserGroup.EndDate is null and (Enabled = 1 or Enabled is null))
		and ConditionTest = 'Success'

--Only when all groups have approved can the TaskNode be deleted and progression made
--Note that there might be various nodes allocated to this task (not just one node with many groups), so while we can happily 
--delete all taskNodes without a nodeId or groupId check (because we have checked to ensure there were no open group assignments) we 
--then need to run the "next node" test for every possible group
--Therefore, before deleting the taskNodes, capture them for the next bit

select NodeId,GroupId from taskNode where taskId = 2
--4,4  (only one node in the example)

--Now delete
delete from taskNode where taskId = 2 

	--The node which passed the test (in the example) is Node 16, find the next node and how to get there (i.e. relationship)
	--Need to add a "nodetype" flag to indicate if they are decision nodes or state nodes

	select OutputNodeId, ConditionTest, ConditionDescription, 	RelationTypeId, Type, AccessType 
	from BranchNode B
	join 
	BranchCondition C on B.ConditionId =  C.ConditionId 
	Where NodeId = 16

--Code to check for other nodes goes here - we grabbed them earlier remember.  Same code as used at start of process
--Only grab the success nodes

	select OutputNodeId, ConditionTest, ConditionDescription, 	RelationTypeId, Type, AccessType 
	from BranchNode B
	join 
	BranchCondition C on B.ConditionId =  C.ConditionId 
	Where NodeId IN
	(
	select OutputNodeId from BranchNode where NodeId = 4
	)
	and ConditionTest = 'Success'   --Simplistic for demo
	
	--Probably need a more robust way to indicate success nodes.  Maybe the "type" field or maybe add another field.  Dunno.
--It may be that there are multiple outputs from a node, not just a single Success.  So maybe we check for all but "reject".  
--Or we might want to poll through TaskAssignmentHistory to see what the ConditionTests were and re-run them.  Probably safest.
 --Better test below:
 --ConditionTest in (Select ConditionTest from TaskAssignmentHistory where NodeId = 4 and TaskId = 2)

 --In this case, we are done so no output, process ended

update task set DateUpdated = getdate() where taskId = 2

--END APPROVAL PROCESS

--END Unanimous Process

--######################################



--Voting is the same as the Unanimous except that the function for determining whether to move to the next node is predicated on more success votes than 50% of the total
--We can do that with a generic function for "moveNext" 

--Check for Unanimity

-- (note that we'd probably want to iterate all possible Condition Tests here eventually, but for example have just done "Success" and "Reject" coded rather than querying BranchNode)

--Success CHeck (if the state of the event that triggered this process was "Success"
	--Check if there are other approvers outstanding for the user's group
	--Bear in mind the comment above about people coming into and out of the group

	select count(1) from TaskAssignmentHistory where 
	TaskId = 2
	and
	GroupId = 4
	and ApproverId in (Select PersonId from UserGroup where GroupId = 4 and UserGroup.EndDate is null and (Enabled = 1 or Enabled is null))
	and ConditionTest = 'Success'

	select count (PersonId) 
	from UserGroup 
	where GroupId = 4 
	and UserGroup.EndDate is null and (Enabled = 1 or Enabled is null)

	--Compare the two counts and if the total approved is less than 50% of the total in the group, keep task open
	--But if all have approved, remove this assignment *for this group only*
	delete from TaskAssignment where taskId = 2 and GroupId = 4 and NodeId = 4


--Rejection Check (if the state of the event that triggered this process was "Success"

	--Check we haven't got a majority of Rejections too

	-- (note that we'd probably want to iterate all possible Condition Tests here eventually)

	select count(1) from TaskAssignmentHistory where 
	TaskId = 2
	and
	GroupId = 4
	and ApproverId in (Select PersonId from UserGroup where GroupId = 4 and UserGroup.EndDate is null and (Enabled = 1 or Enabled is null))
	and ConditionTest = 'Rejection'

	select count (PersonId) 
	from UserGroup 
	where GroupId = 4 
	and UserGroup.EndDate is null and (Enabled = 1 or Enabled is null)

	--Compare the two counts and if the total rejected is less than 50% of the total in the group, keep task open, else close it down as failed.


--Further Group Checks


--Next check to see if there are other groups to which this task is also assigned  (as the relationship can be to multiple groups, potentially)
--in order to prevent deletion of the TaskNode before everyone has approved

	select groupId from TaskAssignment where 
	TaskId = 2
	and Groupid <> 4
--For each Group (gid)
		select count(1) from TaskAssignmentHistory where 
		TaskId = 2
		and GroupId = Gid 
		and ApproverId in (Select PersonId from UserGroup where GroupId = GId and UserGroup.EndDate is null and (Enabled = 1 or Enabled is null))
		and ConditionTest = 'Success'

--Only when all groups have a majority of approvals can the TaskNode be deleted and progression made
--Note that there might be various nodes allocated to this task (not just one node with many groups), so while we can happily 
--delete all taskNodes without a nodeId or groupId check (because we have checked to ensure there were no open group assignments) we 
--then need to run the "next node" test for every possible group

--From here on, same as the unanimous sequence

--Hierarchical is the same as sequential except the moveNext condition check is to check if there is the same relationship as the one we just used, 
--i.e. does the approvers group itself have another approvers group above it

--For example, with Node 2 being "start", 18 being the First Approval Node and 19 being SUccess output and 20 being failure output we have
--First approval is from Node 2 which goes to Node 18 via the "ApproversHierachcical" relationship and that will eventually go to Nodes 19 and 20
--So when we get our first approval we check the node on which we generated this approval to see what relationship type it used
--We find that the RelationTypeId is "2" for Hierachical
--Therefore we check our current group using that same "hierarchical" relationship and we do a new TaskAssignment using *the same node*
--We only progress to Nodes 19 and 20 if we find no more groups in the hierarchy tree

select OutputNodeId, ConditionTest, ConditionDescription, 	RelationTypeId, Type, AccessType 
from BranchNode B
join 
BranchCondition C on B.ConditionId =  C.ConditionId 
Where NodeId = 2
--18	Null	No Test	2	Start	NULL

--Find the group related to the current group (which was 1) via relationship 2 (Hierarchical approvers) for the hierarchical process

select RelativeGroupId from GroupRoleRelation where 
	ApprovalProcessId = 4 AND
	MasterGroupId = 1 AND 
	RelationTypeId  = 2

--2


