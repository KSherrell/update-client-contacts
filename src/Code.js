function onOpen(e) {
    SpreadsheetApp.getUi()
        .createMenu('Update Contacts')
        .addItem('Update Contacts', 'updateContactGroups')
        .addSeparator()
        .addItem('Send Update Email ', 'sendUpdateEmail')
        .addToUi();
}

function updateContactGroups() {
    let str = "";
    //first, clear everything and create new empty groups
    let allClear = clearContactGroups();

    //then, create the Contacts and add them to the Groups -- can I do this all in one step w/o tripping it up over itself?
    if (allClear) {
        let newContacts = createContactsFromList();
        if (newContacts) {
            //add contacts to groups
            for (let i = 0; i < newContacts.length - 1; i++) {
                let groupName = newContacts[i][0];
                let contactEmail = newContacts[i][1];
                contactEmail = ContactsApp.getContact(contactEmail);
                groupName = ContactsApp.getContactGroup(groupName);
             
                if(groupName && contactEmail){
                   contactEmail.addToGroup(groupName);  
                     }
                //str += groupName + " " + contactEmail;
            }
        }
    }
}

function createContactsFromList() {
    //contactsTab
    let contactsTab = SpreadsheetApp.getActive().getSheetByName('contacts');
    let contactsLastRow = contactsTab.getLastRow();
    let contactsListArr = contactsTab.getRange(2, 1, contactsLastRow, 2).getValues();
    let str = "";

    //just creating us some contacts, that's all. nothin' to see here
    for (let i = 0; i < contactsLastRow; i++) {
        let contactEmail = contactsListArr[i][1].trim();
        let isContact = ContactsApp.getContact(contactEmail);
        if (!isContact) {
            let newContact = ContactsApp.createContact('', '', contactEmail);
        }
    }
    return contactsListArr;
};

function clearContactGroups() {
    let companyTab = SpreadsheetApp.getActive().getSheetByName('companyNameList');
    let companyLastRow = companyTab.getLastRow();
    let companyNamesListArr = companyTab.getRange(2, 1, companyLastRow).getValues(); //returns array
    let companyLen = companyNamesListArr.length - 1;

    //iterate through the company list and delete company groups and the group members
    for (let i = 0; i < companyLen; i++) {
        let groupName = companyNamesListArr[i];
        let deletedGroup = ContactsApp.getContactGroup(groupName);
        if (deletedGroup) {
            let contacts = deletedGroup.getContacts();
            for (var j in contacts) {
             if(contacts[j]){
             deletedGroup.removeContact(contacts[j])
             }
            }
           
        } else {
        ContactsApp.createContactGroup(groupName);
        }
    }
    return true;
} //end function

function showOutputBox(str, title) {
    var html = HtmlService.createHtmlOutput('<pre>' + str + '</pre>')
        .setWidth(400)
        .setHeight(300);
    SpreadsheetApp.getUi().showModalDialog(html, title);
}

function sendUpdateEmail() {};
