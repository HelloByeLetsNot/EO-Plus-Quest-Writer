// Load JSON data
let stats, actions, rules;

fetch('stats.json')
    .then(response => response.json())
    .then(data => stats = data);

fetch('actions.json')
    .then(response => response.json())
    .then(data => actions = data);

fetch('rules.json')
    .then(response => response.json())
    .then(data => rules = data);

const addStateButton = document.getElementById('addState');
const generateButton = document.getElementById('generateCode');
const statesContainer = document.getElementById('statesContainer');
const questNameInput = document.getElementById('questName');
const questVersionInput = document.getElementById('questVersion');
const outputContainer = document.getElementById('outputContainer');
const downloadButton = document.getElementById('downloadButton');

let stateCounter = 1;

// Event listener to add a new state
addStateButton.addEventListener('click', () => {
    addState();
});

function addState() {
    const stateElement = document.createElement('div');
    stateElement.classList.add('state');
    stateElement.innerHTML = `
        <h3>State ${stateCounter}</h3>
        <label for="stateName${stateCounter}">State Name:</label>
        <input type="text" id="stateName${stateCounter}" name="stateName${stateCounter}">
        <label for="desc${stateCounter}">Description:</label>
        <input type="text" id="desc${stateCounter}" name="desc${stateCounter}">
        <div id="actions${stateCounter}">
            <h4>Actions</h4>
            <button type="button" onclick="addAction(${stateCounter})">Add Action</button>
        </div>
        <div id="rules${stateCounter}">
            <h4>Rules</h4>
            <button type="button" onclick="addRule(${stateCounter})">Add Rule</button>
        </div>
    `;
    statesContainer.appendChild(stateElement);
    stateCounter++;
}

function addAction(stateId) {
    const actionsContainer = document.getElementById(`actions${stateId}`);
    const actionElement = document.createElement('div');
    actionElement.classList.add('action');
    actionElement.innerHTML = `
        <label for="action${stateId}">Action:</label>
        <select id="action${stateId}">
            ${actions.map(action => `<option value="${action.name}">${action.name} - ${action.usage}</option>`).join('')}
        </select>
        <label for="actionParams${stateId}">Parameters:</label>
        <input type="text" id="actionParams${stateId}" name="actionParams${stateId}">
    `;
    actionsContainer.appendChild(actionElement);
}

function addRule(stateId) {
    const rulesContainer = document.getElementById(`rules${stateId}`);
    const ruleElement = document.createElement('div');
    ruleElement.classList.add('rule');
    ruleElement.innerHTML = `
        <label for="rule${stateId}">Rule:</label>
        <select id="rule${stateId}">
            ${rules.map(rule => `<option value="${rule.name}">${rule.name} - ${rule.usage}</option>`).join('')}
        </select>
        <label for="ruleParams${stateId}">Parameters:</label>
        <input type="text" id="ruleParams${stateId}" name="ruleParams${stateId}">
    `;
    rulesContainer.appendChild(ruleElement);
}

// Event listener to generate the quest code
generateButton.addEventListener('click', () => {
    generateCode();
});

function generateCode() {
    const questName = questNameInput.value;
    const questVersion = questVersionInput.value;
    let code = `Main {\n    questname "${questName}"\n    version ${questVersion}\n}\n`;

    const stateElements = document.querySelectorAll('.state');
    stateElements.forEach((stateElement, index) => {
        const stateName = stateElement.querySelector(`input[name="stateName${index + 1}"]`).value;
        const desc = stateElement.querySelector(`input[name="desc${index + 1}"]`).value;

        code += `State ${stateName} {\n`;
        if (desc) {
            code += `    desc "${desc}"\n`;
        }

        const actionElements = stateElement.querySelectorAll('.action');
        actionElements.forEach(actionElement => {
            const action = actionElement.querySelector('select').value;
            const actionParams = actionElement.querySelector(`input[name="actionParams${index + 1}"]`).value;
            code += `    action ${action}(${actionParams});\n`;
        });

        const ruleElements = stateElement.querySelectorAll('.rule');
        ruleElements.forEach(ruleElement => {
            const rule = ruleElement.querySelector('select').value;
            const ruleParams = ruleElement.querySelector(`input[name="ruleParams${index + 1}"]`).value;
            code += `    rule ${rule}(${ruleParams}) goto ${stateName}\n`;
        });

        code += '}\n';
    });

    // Output generated code to the site
    const codeOutput = document.createElement('pre');
    codeOutput.textContent = code;
    outputContainer.innerHTML = ''; // Clear previous output
    outputContainer.appendChild(codeOutput);

    // Enable download button with the generated code
    downloadButton.style.display = 'block';
    downloadButton.onclick = () => download('quest.eqf', code);
}

function download(filename, text) {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}