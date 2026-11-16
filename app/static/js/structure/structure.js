function getStructureSubBtns() {
    return [
        {
            name: 'Сущности',
            id: 0,
            getContent: getEntitiesPageContent,
            start: startEntitiesPage
        },
        {
            name: 'Параметры',
            id: 1,
            getContent: getParamsPageContent,
            start: startEntitiesPage
        },
        {
            name: 'Этапы',
            id: 2,
            getContent: getStagesPageContent,
            start: startStagesPage
        }
    ];
}

function getEntitiesPageContent() {
    return entitiesPageContent;
}

function getParamsPageContent() {
    return paramsPageContent;
}

function getStagesPageContent() {
    return stagesPageContent;
}