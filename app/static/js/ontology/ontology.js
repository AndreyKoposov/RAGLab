function getOntologySubBtns() {
    return [
        {
            name: 'XML',
            id: 0,
            getContent: () => { return xmlPageContent },
            start: startXmlPage
        },
        {
            name: 'PDF',
            id: 1,
            getContent: () => { return pdfPageContent },
            start: startPDFPage
        }
    ];
}
