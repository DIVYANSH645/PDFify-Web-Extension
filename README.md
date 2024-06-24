# PDFify

"PDFify Web Extension" is a Chrome extension designed to convert text content from web pages into PDF files. The project leverages various technologies, including Express.js for the backend server, EJS for templating, Tailwind CSS for styling, and the Google Generative AI API for text processing. The extension enables users to select text on any webpage and convert it into a PDF directly through the browser.

## Project Structure:

Project Structure
The project consists of several key files, each serving a specific purpose:

1.```server.js``` - Main server file, handles PDF generation and file management.

2.```views/allpdfs.ejs``` - EJS template for displaying a list of generated PDFs.

3.```views/index.ejs``` - EJS template for the main application interface.

4.```manifest.json``` - Configuration file for the Chrome extension.

5.```background.js``` - Background script for the Chrome extension.

## Key Functionalities:

1.```Context Menu:-```Adds a context menu item for converting selected text to PDF

2.```Text Processing:-```Captures selected text and sends it to the server for PDF generation.

3.```PDF Download:-```Handles the PDF file download once generated.



## Workflow:
![diagram-export-6-24-2024-1_48_38-PM](https://github.com/DIVYANSH645/PDFify-Web-Extension/assets/82891741/412f2eb8-cc49-4bbc-b014-9fb1343cddda)


## Screenshots:

![2](https://github.com/DIVYANSH645/PDFify-Web-Extension/assets/82891741/a30f8530-dad4-4671-ba72-ace187c90521)
______________________________________________________________________________________________________________
______________________________________________________________________________________________________________

![1](https://github.com/DIVYANSH645/PDFify-Web-Extension/assets/82891741/9b55ef8f-a18d-4ffa-a995-19376a4701bc)

______________________________________________________________________________________________________________
______________________________________________________________________________________________________________

![3](https://github.com/DIVYANSH645/PDFify-Web-Extension/assets/82891741/d068fcdd-4da9-4be6-bbe7-b8da48fc6821)

______________________________________________________________________________________________________________
______________________________________________________________________________________________________________


## Conclusion:
PDFify Web provides a seamless solution for converting text content into PDF files directly from the browser. The integration of modern web technologies ensures a responsive and user-friendly experience, while the use of Google Generative AI enhances text processing capabilities. The Chrome extension further extends the functionality, making it easy for users to convert web content into PDFs on the fly.

