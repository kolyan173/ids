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
main ();
function main() {
    var datafile = File.openDialog("Select a .json file"),
        pathData = datafile.absoluteURI,
        inputData = $.evalFile(pathData), //  read the input data (.json) 
        myDocument = app.documents.add();
        
    myDocument.documentPreferences.facingPages = false;
    
    for(var i=0; i < inputData.length; i++) {
        var contentResult = [],
            newFrame = true,
            contentArr = inputData[i].content,
            currentPage;
        
        if(contentArr.length > 0) { 
            for(var k = 0; k < contentArr.length; k++) {
                var contentObj = contentArr[k];
                for(var key in contentObj) {
                    var contentText = contentObj[key]; 
                    if(key === "content") {
                        contentResult.push(contentText);
                    } else if(key === "styles") {
                        switch(contentText) {
                            case "paragraph": 
                                var last = contentResult.pop();
                                contentResult.push('\n');
                                contentResult.push(last);
                                break;
                        }
                    }
                }
            }
        }
        if(contentResult.length > 0) {
            var frameText = "",
                pageNumber,
                frameBounds;
            for(var index = 0; index < contentResult.length; index++) {
              //each item in frames[n] should be inserted as indesign element (for example paragraph)      
              frameText+= contentResult[index];        
            }
            currentPage = pageMaker (myDocument, i);
            frameBounds = getBounds(myDocument, currentPage);
            //each item in frames array should be inserted as indesign text frame
            textFrameMaker(currentPage, frameBounds, frameText, true);  
        }
    }
    
    myDocument.pages[myDocument.pages.length - 1].remove();
    
    if(app.activeDocument.saved == false) {
        // save indesign object model (document) as INDD file
        app.activeDocument.save(File.saveDialog("Enter .indd file name")); 
    }
    //from INDD file create PDF file
    app.activeDocument.exportFile(ExportFormat.pdfType, File.openDialog("Enter .pdf file name"), false);
};

function textFrameMaker(myPage, myBounds, myString, myFitToContent, myFontName){
    var currentTextFrame = myPage.textFrames.add();
    currentTextFrame.texts.item(0).insertionPoints.item(0).contents = myString;
    if(myFontName) {
        currentTextFrame.texts.item(0).parentStory.appliedFont = app.fonts.item(myFontName);
    }
    currentTextFrame.geometricBounds = myBounds;
   if(myFitToContent == true){
       //currentTextFrame.fit(FitOptions.frameToContent);
    }
    return currentTextFrame;
};

function getBounds(myDocument, myPage) {
    var myPageWidth = myDocument.documentPreferences.pageWidth;
    var myPageHeight = myDocument.documentPreferences.pageHeight;
    if(myPage.side == PageSideOptions.leftHand){
        var myX2 = myPage.marginPreferences.left;
        var myX1 = myPage.marginPreferences.right;
    }
    else{
        var myX1 = myPage.marginPreferences.left;
        var myX2 = myPage.marginPreferences.right;
    }
    var myY1 = myPage.marginPreferences.top,
        myX2 = myPageWidth - myX2,
        myY2 = myPageHeight - myPage.marginPreferences.bottom; 
    
    return [myY1, myX1, myY2, myX2];
};

function pageMaker(myDocument, pageNumber) {
    if(pageNumber) {
        myDocument.pages.add();  
    }
    currentPage = myDocument.pages.lastItem();
    return currentPage;
};

