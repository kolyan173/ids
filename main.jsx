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

var datafile = File.openDialog("Select a .json file");
var pathData = datafile.absoluteURI;
var inputData = $.evalFile(pathData); //  read the input data (.json) 
var FramesPositionTop = 0;
var myDocument =app.documents.add();
myDocument.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.points;
myDocument.viewPreferences.verticalMeasurementUnits = MeasurementUnits.points; 
for(var i=0; i < inputData.length; i++) {
    var contentResult = [];
    var newFrame = 1;
    var contentArr = inputData[i].content;
    var currentPage;
    if(contentArr.length > 0) { 
        for(var k = 0; k < contentArr.length; k++) {
            var contentObj = contentArr[k];
            for(var a in contentObj) {
                if(a === "content") {
                    var myText = contentObj[a]; 
                    if(newFrame) {
                        newFrame = 0;
                        var countPage = myDocument.pages.length - 1;
                        myDocument.pages.add();
                        currentPage = myDocument.pages.item(countPage);
                        contentResult.push(myText);
                    } else {
                            contentResult.push(myText);
                        }                                                          
                } else if(a === "styles") {
                    switch(contentObj[a]) {
                        case "paragraph": 
                                var last = contentResult.pop();
                                contentResult.push('\n');
                                contentResult.push(last);
                            break;
                        case "italic":
                           // myTextFrame.texts.item(0).parentStory.appliedFont = app.fonts.item("Myriad Pro");
                    }
                }
            }
        }
    }
    if(contentResult.length > 0) {
        var frameText = "";
        for(var m = 0; m < contentResult.length; m++) {
              //each item in frames[n] should be inserted as indesign element (for example paragraph)      
              frameText+= contentResult[m];        
           }
        //each item in frames array should be inserted as indesign text frame
        TextFrameMaker(currentPage, GetBounds(myDocument, currentPage), frameText, true);        
    }
}
myDocument.pages[myDocument.pages.length - 1].remove();

function TextFrameMaker(myPage, myBounds, myString, myFitToContent, myFontName,){
    var currentTextFrame = myPage.textFrames.add();
    currentTextFrame.texts.item(0).insertionPoints.item(0).contents = myString
    if(myFontName) {
        currentTextFrame.texts.item(0).parentStory.appliedFont = app.fonts.item(myFontName);
    }
    currentTextFrame.geometricBounds = myBounds;
    if(myFitToContent == true){
        currentTextFrame.fit(FitOptions.frameToContent);
    }
    return currentTextFrame;
};


function GetBounds(myDocument, myPage){
    var myPageWidth = myDocument.documentPreferences.pageWidth;
    var myPageHeight = myDocument.documentPreferences.pageHeight
    if(myPage.side == PageSideOptions.leftHand){
        var myX2 = myPage.marginPreferences.left;
        var myX1 = myPage.marginPreferences.right;
    }
    else{
        var myX1 = myPage.marginPreferences.left;
        var myX2 = myPage.marginPreferences.right;
    }
    var myY1 = myPage.marginPreferences.top + FramesPositionTop;
    var myX2 = myPageWidth - myX2;
    var myY2 = myPageHeight - myPage.marginPreferences.bottom; 
    FramesPositionTop = myY1;
    return [myY1, myX1, myY2, myX2];
};

if(app.activeDocument.saved == false){
// save indesign object model (document) as INDD file
    app.activeDocument.save(File.saveDialog("Enter .indd file name")); 
}
//from INDD file create PDF file
app.activeDocument.exportFile(ExportFormat.pdfType, File.openDialog("Enter .pdf file name"), false);
