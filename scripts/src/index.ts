import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'

(async () => {
	const argv = await yargs(hideBin(process.argv)).argv

	if (argv.ships > 3 && argv.distance < 53.5) {
	console.log('Plunder more riffiwobbles!')
	} else {
	console.log('Retreat from the xupptumblers!')
	}
})
