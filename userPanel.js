import UserPanel from '/shared/userPanel.js';
import Typeforward from "../../shared/typeforward.js";
import {Utility} from "../../shared/utility.js";

export default class ModuleUserPanel extends UserPanel {
	async generate(panel) {
		let moduleFolder = 'Music';
		
		// TODO: Get these paths another way.
		let modulePath = '../../modules/' + moduleFolder;
		
		//let settings = await UserPanel.LoadSettings(panel.name);
		
		let fragment = document.createDocumentFragment();
		
		// TODO: Make this logic shared with something in the video folder
		let items = Utility.getAllPaths(module.globalSettings.fileStructure.userData.Sound, [ 'mp3', 'wav', 'flac' ]);

		// Controls section
		let controlGroup = document.createElement('div');
		controlGroup.className = 'row';
		let stopEl = await this.createModuleFunctionButton('Stop', 'Sound.Stop');
		controlGroup.appendChild(stopEl);
		fragment.appendChild(controlGroup);
		
		let elementGroup = document.createElement('div');
		elementGroup.className = 'row';
	
		// Create a section for just playing a track
		let typeforward = await Typeforward.Create(items, elementGroup);
		
		let playButtonEl = await this.createModuleFunctionButton(
			'Play', 
			'Sound.Play',
			() => typeforward.value
		);
		elementGroup.appendChild(playButtonEl);
		fragment.appendChild(elementGroup);
		
		//fragment.appendChild(await UserPanel.CreateSettingsBlock(panel, modulePath + '/settingsInputs.json'));
		
		return fragment;
	}
	
	async createModuleFunctionButton(buttonName, commandName, valueGetter = null) {

		let buttonEl = document.createElement('button');
		buttonEl.innerHTML = buttonName;
		buttonEl.addEventListener('click', () => {
			// TODO: Hoist
			let value = valueGetter ? valueGetter() : null;
			module.F(commandName, value);
		});
		return buttonEl;
	}
}