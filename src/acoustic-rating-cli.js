import { program } from 'commander'
import fs from 'fs'
import CsvConverter from '@vyzn-tech/lib-acoustic-rating/dist/csv-converter.js'
import { AcousticRatingCalculator } from '@vyzn-tech/lib-acoustic-rating/dist/calculator.js'
import { processIfcBuffer } from '@bldrs-ai/ifclib'
import path from 'path'

program
  .requiredOption('-i, --input <path>', 'path to the input file, either .ifc or .csv')
  .requiredOption('-eac, --external-acoustic-ratings <path>', 'path to json containing external-acoustic-ratings')
  .requiredOption('-o, --output <path>', 'path to the output file, either .ifc or .csv')
  .option('-f, --force', 'force overwrite existing file')

program.version('0.0.1')
program.description('Calculate Acoustic-Ratings')
program.parse()

const inputPath = program.getOptionValue('input')
const externalAcousticRatingsPath = program.getOptionValue('externalAcousticRatings')
const outputPath = program.getOptionValue('output')
const force = program.getOptionValue('force')

if (fileExists(outputPath) && !force) {
  console.error(`Error: File ${outputPath} already exists. Use -f to force overwrite.`)
  process.exit(1)
}

if (fileExists(inputPath) && fileExists(externalAcousticRatingsPath)) {
  const externalAcousticRatings = JSON.parse(
    fs.readFileSync(externalAcousticRatingsPath, { encoding: 'utf8', flag: 'r' }),
  )

  const items = [];
  const fileExtension = path.extname(inputPath).toLowerCase()
  switch(fileExtension) {
    case '.csv': {
      const csvString = fs.readFileSync(inputPath, { encoding: 'utf8', flag: 'r' })  
      const components = new CsvConverter().convertToComponents(csvString)
      items.push(components)
      break
    }
    case '.ifc': {
      const ifcRaw = fs.readFileSync(inputPath)
      const ifcProps = await processIfcBuffer(ifcRaw)
      var components = []; 
      // todo: transform ifcprops to components
      items.push(components)
      break;
    }
    default:
      throw `File extension '${format}' not supported.`
  }

  const calculator = new AcousticRatingCalculator(items, externalAcousticRatings)
  const outputItemCollection = calculator.calculate()
  const outputJsonString = JSON.stringify(outputItemCollection)

  // todo transform components to ifcprops and save it back

  fs.writeFileSync(outputPath, outputJsonString, { encoding: 'utf8' })
} else {
  process.exit(1)
}

function fileExists(path) {
  try {
    return fs.existsSync(path)
  } catch (_) {
    console.error(`Error: File ${path} does not exist.`)
    return false
  }
}
