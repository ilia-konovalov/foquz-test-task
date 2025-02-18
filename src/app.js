import './styles/normalize.css';
import './styles/app.css';
import ko from 'knockout';
import './dragdrop';
import arrowIcon from './assets/arrow-icon.svg';
import dndIcon from './assets/dnd-icon.svg';

function Document(title) {
    this.title = ko.observable(title);
}

function Category(title, documents) {
    this.title = ko.observable(title);
    this.documents = ko.observableArray(documents);
    this.isExpanded = ko.observable(false);

    this.toggleExpand = () => {
        this.isExpanded(!this.isExpanded());
    };
}

function ViewModel() {
    this.icons = {
        arrow: arrowIcon,
        dnd: dndIcon
    };
    
    this.categories = ko.observableArray([
        new Category('Обязательные для всех', [new Document('Паспорт'), new Document('ИНН')]),
        new Category('Обязательные для трудоустройства', [new Document('Трудовой договор'), new Document('Военный билет')]),
        new Category('Специальные', [new Document('Ноутбук'), new Document('Свидетельство о рождении')]),
    ]);

    this.handleCategoryDrop = (sourceData, targetData, event) => {
        if (sourceData && targetData && sourceData !== targetData) {
            const categories = this.categories();
            const sourceIndex = categories.indexOf(sourceData);
            const targetIndex = categories.indexOf(targetData);
            
            if (sourceIndex > -1 && targetIndex > -1) {
                this.categories.splice(targetIndex, 0, this.categories.splice(sourceIndex, 1)[0]);
            }
        }
    };

    this.handleDocumentDrop = (targetDoc, targetCategory, sourceDoc, event) => {
        if (sourceDoc && sourceDoc !== targetDoc) {
            const categories = this.categories();
            const sourceCategory = categories.find(category => 
                category.documents().includes(sourceDoc)
            );

            if (sourceCategory) {
                sourceCategory.documents.remove(sourceDoc);

                const targetIndex = targetCategory.documents().indexOf(targetDoc);
                
                if (targetIndex > -1) {
                    targetCategory.documents.splice(targetIndex, 0, sourceDoc);
                } else {
                    targetCategory.documents.push(sourceDoc);
                }
            }
        }
    };
}

ko.applyBindings(new ViewModel()); 