# acoustic-rating-cli

acoustic-rating-cli is a Javascript commandline-tool which calculates acoustic rating requirements for IFC-data according to SIA 181.

## Usage

Use the package runner [npx](https://github.com/npm/npm/releases/tag/v5.2.0) to execute acoustic-rating-cli.
```bash
$ npx @vyzn-tech/acoustic-rating-cli --help

Options:
  -i, --input-csv <path>                    path to input csv containing IFC-Data
  -eac, --external-acoustic-ratings <path>  path to json containing external-acoustic-ratings
  -o, --output <path>                       path to output.csv
  -f, --force                               force overwrite existing file
  -V, --version                             output the version number
  -h, --help                                display help for command
```

```bash
npx @vyzn-tech/acoustic-rating-cli --input-csv ./example/input.csv --external-acoustic-ratings ./example/external_acoustic_ratings.json --output test.json
```

## Expected Input
A documentation about the required file structure can be found at [lib-acoustic-rating](https://github.com/vyzn-tech/lib-acoustic-rating#readme).

You can also take a look at some example files [here](example/).

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)