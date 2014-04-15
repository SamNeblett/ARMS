#pragma strict

public var gcObj : GameObject;

function OnTriggerEnter (area : Collider) {
	var gc : GUI_MainResources = gcObj.GetComponent(GUI_MainResources);
	var areaTag : String = area.gameObject.tag;
	
	switch (areaTag) {
		case "MiningSite":
			gc.RoverArrived("MiningSite");
			break;
		case "OxygenFactory":
			gc.RoverArrived("OxygenFactory");
			break;
		case "SupplyDepot":
			gc.RoverArrived("SupplyDepot");
			break;
	}
}