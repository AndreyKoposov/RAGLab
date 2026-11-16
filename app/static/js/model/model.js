function getPredictSubBtns() {
    return [
        {
            name: 'Параметры',
            id: 0,
            getContent: () => { return tablePageContent },
            start: startTablePage
        }
    ];
}
