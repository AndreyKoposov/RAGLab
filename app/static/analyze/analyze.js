function getAnalyzeSubBtns() {
    return [
        {
            name: 'Граф',
            id: 0,
            getContent: () => { return graphPageContent },
            start: startGraphPage
        },
        {
            name: 'Статистика',
            id: 1,
            getContent: () => { return statsPageContent },
            start: () => {}
        },
        {
            name: 'Симуляция',
            id: 2,
            getContent: () => { return simulationPageContent },
            start: () => {}
        }
    ];
}
