/**
 * You can include/read data in different ways
 *
 * - Save data as json file and then read using File('path/to/file')
 * - Include data as script using #include 'path/to/file' (simple js file that will expose some data)
 * - Execute the file from filesystem using add.doScript('path/to/file') or $.evalFile('path/to/file')
 * - Include data into source code
 *
 * You need to:
 *  - read the data from fs or INDD file
 *  - convert data into indesign object model
 *    - each item in frames array should be inserted as indesign text frame
 *    - each item in frames[n] should be inserted as indesign element (for example paragraph)
 *    - need to apply styles to each inserted item (like bold, underline)
 *
 * - save indesign object model (document) as INDD file
 * - from INDD file create PDF file
 */