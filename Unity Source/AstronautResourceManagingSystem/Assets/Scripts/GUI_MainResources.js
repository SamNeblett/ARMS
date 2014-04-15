#pragma strict

//public var gcObj : GameObject;

private var xNative : float = 1280;
private var yNative : float = 800;
public var guiSkin1 : GUISkin;
public var guiSkin2 : GUISkin;
public var guiSkin3 : GUISkin;
public var guiSkin4 : GUISkin;

public var oxygenLevel : float = 100.0;
public var powerLevel : float = 100.0;
public var cargoLevel : float = 0.0;
public var supplyLevel : float = 30;

public var rover : GameObject;
private var roverAgent : NavMeshAgent;
public var astronaut : GameObject;
public var camAstronaut : Camera;

public var directive : Transform;
public var roverMoving : boolean = false;

public var miningSite : Transform;
public var oxygenFactory : Transform;
public var supplyDepot : Transform;

public var usePower : boolean = true;
public var loadingCargo : boolean;
public var unloadingCargo : boolean;

private var focusUI : boolean = true;

function Awake () {
	roverAgent = rover.GetComponent(NavMeshAgent);
	
	// Starting directive, go to mining site to pick up mined material
	directive = miningSite;
}

function OnGUI () {
	// Scale UI with 1280x800 reference
	var resX : float = Screen.width/xNative;
	var resY : float = Screen.height/yNative;
	GUI.matrix = Matrix4x4.TRS(Vector3(0,0,0), Quaternion.identity, Vector3(resX,resY,1)); 
	
	if(focusUI) {
		// Oxygen Level
		GUI.skin = guiSkin1;
		GUI.Box (Rect (100,550,160,-oxygenLevel * 5), "");
		GUI.Label (Rect (100,560,160,150), "Oxygen Level:\n" + oxygenLevel.ToString("#0.0") + "%");
		
		// Suit Power
		GUI.skin = guiSkin2;
		GUI.Box (Rect (360,550,160,-powerLevel * 5), "");
		GUI.Label (Rect (360,560,160,150), "Suit Power:\n" + powerLevel.ToString("#0.0") + "%");
		
		// Rover Level
		GUI.skin = guiSkin3;
		GUI.Box(Rect (620,550,160,-cargoLevel * 5), "");
		GUI.Label(Rect (620,560,160,150), "Rover Cargo:\n" + cargoLevel.ToString("#0.0") + "%");
		
		// Supply Depot Resources
		GUI.skin = guiSkin4;
		GUI.Box(Rect (1020,550,160,-supplyLevel * 5), "");
		GUI.Label(Rect (1020,560,160,150), "Supply Depot Resources:\n" + supplyLevel.ToString("#0.0") + "%");
		
		// Astronaut camera toggle
		if(GUI.Button(Rect (20,730,220,50), "View Live Video Feed")) {
			camAstronaut.enabled = true;
			focusUI = false;
		}
		
		// Break current directive and call astronaut back to Supply Depot
		if(GUI.Button(Rect (860,730,400,50), "Break Directive:\n" + "Call Astronaut Back To [SUPPLY DEPOT]")) {
			directive = supplyDepot;
			loadingCargo = false;
			unloadingCargo = false;
		}
	}
	//View Status & Logistics
	else {
		GUI.skin = guiSkin1;
		
		// Astronaut camera toggle
		if(GUI.Button(Rect (20,730,220,50), "View Status & Logistics")) {
			camAstronaut.enabled = false;
			focusUI = true;
		}
		
		// Break current directive and call astronaut back to Supply Depot
		if(GUI.Button(Rect (860,730,400,50), "Break Directive:\n" + "Call Astronaut Back To [SUPPLY DEPOT]")) {
			directive = supplyDepot;
			loadingCargo = false;
			unloadingCargo = false;
		}
	}
}

function Update () {
	// Depleting levels of supplies over time
	supplyLevel = supplyLevel - (Time.deltaTime * 0.01);
	
	if (usePower) {
		oxygenLevel = oxygenLevel - (Time.deltaTime * 0.2);
		powerLevel = powerLevel - (Time.deltaTime * 0.4);
	}
	if (loadingCargo) {
		cargoLevel = cargoLevel + (Time.deltaTime * 3);
		if(cargoLevel >= 100) {
			cargoLevel = 100;
			if(directive == miningSite) {
				directive = oxygenFactory;
				loadingCargo = false;
				return;
			}
			if(directive == oxygenFactory) {
				directive = supplyDepot;
				loadingCargo = false;
				return;
			}
		}
	}
	
	if (unloadingCargo) {
		cargoLevel = cargoLevel - (Time.deltaTime * 7);
		if(cargoLevel <= 0) {
			cargoLevel = 0;
			if(directive == oxygenFactory) {
				loadingCargo = true;
			}
			unloadingCargo = false;
		}
	}
	
	if (!usePower){
		oxygenLevel = oxygenLevel + (Time.deltaTime * 7);
		powerLevel = powerLevel + (Time.deltaTime * 2);
		if(oxygenLevel >= 100) {
			oxygenLevel = 100;
		}
		if(powerLevel >= 100) {
			powerLevel = 100;
		}
		if(oxygenLevel && powerLevel >= 100){
			if(!unloadingCargo) {
				directive = miningSite;
				if(supplyLevel < 95) {
					supplyLevel = supplyLevel + 5;
				}
				usePower = true;
			}
		}
	}
	
	if (!roverMoving){
		roverAgent.SetDestination(directive.position);
	}
}

function RoverArrived (site : String) {
	if(site == directive.name){
		switch (site) {
			case "MiningSite":
				loadingCargo = true;
				break;
			case "OxygenFactory":
				unloadingCargo = true;
				break;
			case "SupplyDepot":
				unloadingCargo = true;
				usePower = false;
				break;
		}
	}
}