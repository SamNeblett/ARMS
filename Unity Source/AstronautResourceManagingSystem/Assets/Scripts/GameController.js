#pragma strict

public var rover : GameObject;
private var roverAgent : NavMeshAgent;

public var roverMoveTo : Transform;
public var testMove : boolean;

function Awake () {
	roverAgent = rover.GetComponent(NavMeshAgent);
}

function Update () {
	if (testMove){
		roverAgent.SetDestination(roverMoveTo.position);
	}
}