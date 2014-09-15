##Pre-requests:
 * download and install adobe indesign http://www.adobe.com/products/indesign.html
 * download and install script toolkit https://creative.adobe.com/products/estk

##Test assignment:
 - to write the script which will run in the adobe indesign javascript runtime and will perform data transformation
 - you can find input data in ./data/sample.json
 - you need to create *.jsx file/files that will read and transform mentioned above data (check the example - ./main.jsx)
 - as a result we need to have created PDF and INDD files

##Details/requirements:

- when your script runs first:
  - read input data (read them from file system or include directly in your script)
  - parse data and convert them to indesign object model (see details below)
  - store object model as an INDD file
  - create from INDD file PDF document
- when you script runs n+1 time:
  - read INDD file
  - read input data 
  - create from INDD file PDF document

- converting/parsing data details:
  - read input data
  - treat each element in array as indesign text frame and create appropriate text frame
  - insert text(content) into frame
  - apply styles if they are
  - repeat until the end

##Workflow details:
- fork this repo and work in your own
- during your work please do not forget to do commit for each logical change/improvement
- when you finish do the pool request