const moduleFunctions = {
	"loadSettings": loadSettings,
	"play": soundPlay,
	"stop": soundStop,
	"logAllOptions": logAllOptions,
};

module.LoadModule(moduleFunctions);

var items = [];
var sounds = [];

var soundUserDataPath = '../../userData/Sound/';

async function loadSettings(name, event)
{
	items = Utility.getAllPaths(module.globalSettings.fileStructure.userData.Sound);
}

async function soundPlay(name, event)
{
	console.log(name, event, "play sound");
	
	var data = {};
	
	// Handle different data types
	if(typeof(event) === 'string')
		data = {
			name: event
		};
	else
		data = event;
	
	Utility.setObjectDefaults(
		data,
		{
			name: null,
			volume:1,
			pan:0,
			rate:1,
		}
	);
	
	var file = Utility.getMatchingFileInList(items, data.name);

	// Don't bother with nonexistent sounds
	if(file == null)
	{
		module.F('Console.LogError', 'No Sound named "' + JSON.stringify(event) + '" found.');
		return;
	}

	var sound = await Utility.playSound(soundUserDataPath + file, data);
	// TODO: make Detune Range a setting
	//sound.detune.value = Utility.getRandomRange(-detuneRange, detuneRange);

	// Add an array to store all of these SFX in
	if(sounds.hasOwnProperty(file) == false)
		sounds[file] = [];

	// Add this sound to the full list
	sounds[file].push(sound);
}

async function soundStop(name, event)
{
	var keys;

	// Stop playing a specific sound
	if(event != null)
	{
		var trackName;

		// If we just got passed a string, assume it's the name of the track and start searching
		if(typeof(event) == 'string')
		{
			event = Utility.getMatchingFileInList(sounds, event);

			// Don't bother with nonexistent sounds
			if(event == null)
				return;
		}

		// Otherwise, if the track passed isn't a number, assume it's the name of the track
		if(isNaN(event.track))
			trackName = event.track;

		// If we DID get a number, assume it's a track id
		else
			trackName = albums[event.album][event.track];

		var trackPath = soundUserDataPath + event.album + '/' + trackName;

		// If this sound isn't in the list, exit out here
		if(sounds.hasOwnProperty(trackPath) == false)
			return;

		keys = [trackPath];
	}
	// Stop playing every sound
	else
		keys = Object.keys(sounds);

	// Stop either the passed sound, or else every sound
	for(var i = keys.length - 1; i >= 0; i --)
	{
		// Stop every instance of every sound
		var key = keys[i];
		for(var instanceI = 0, instanceL = sounds[key].length; instanceI < instanceL; instanceI ++)
			sounds[key][instanceI].stop();

		// Remove this item from the keys list
		delete sounds[key];
	}
}

async function logAllOptions(name, event)
{
	var regexGet = /\/(.+)\.[^.]+$/;
	var trackNames = [];
	var publicLog = '';

	// Get clean names
	for(var i = 0, l = items.length; i < l; i ++)
	{
		var displayName = regexGet.exec(items[i])[1];
		trackNames.push(displayName);
	}

	// Compile them all into one sorted log
	trackNames.sort();
	for(var i = 0, l = trackNames.length; i < l; i ++)
	{
		if(i > 0)
			publicLog += '|';

		publicLog += '"' + trackNames[i] + '"';
	}

	console.log(publicLog);
}