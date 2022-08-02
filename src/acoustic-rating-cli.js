const { program } = require('commander')
const fs = require('fs')
const CsvConverter = require('@vyzn-tech/lib-acoustic-rating/dist/csv-converter').default
const { AcousticRatingCalculator } = require('@vyzn-tech/lib-acoustic-rating/dist/calculator')

program
  .requiredOption('-i, --input-csv <path>', 'path to input csv containing IFC-Data')
  .requiredOption('-eac, --external-acoustic-ratings <path>', 'path to json containing external-acoustic-ratings')
  .requiredOption('-o, --output <path>', 'path to output.csv')
  .option('-f, --force', 'force overwrite existing file')

program.version('0.0.1')
program.description('Calculate Acoustic-Ratings')
program.parse()

if (fileExists(program.getOptionValue('output')) && !program.getOptionValue('force')) {
  console.error(`Error: File ${program.getOptionValue('output')} already exists. Use -f to force overwrite.`)
  process.exit(1)
}

if (fileExists(program.getOptionValue('inputCsv')) && fileExists(program.getOptionValue('externalAcousticRatings'))) {
  const csvAsString = fs.readFileSync(program.getOptionValue('inputCsv'), { encoding: 'utf8', flag: 'r' })
  const externalAcousticRatings = JSON.parse(
    fs.readFileSync(program.getOptionValue('externalAcousticRatings'), { encoding: 'utf8', flag: 'r' }),
  )

  const items = new CsvConverter().convertToComponents(csvAsString)
  const calculator = new AcousticRatingCalculator(items, externalAcousticRatings)
  const outputItemCollection = calculator.calculate()
  const outputJsonString = JSON.stringify(outputItemCollection)

  fs.writeFileSync(program.getOptionValue('output'), outputJsonString, { encoding: 'utf8' })
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
