

import { LightningElement, track } from 'lwc';
import getMcpResponse from '@salesforce/apex/RagGatewayController.getMcpResponse';

export default class RagGatewayDemo extends LightningElement {
  @track userInput = '';
  @track selectedMode = 'method1';
  @track response;

  modeOptions = [
    
    { label: 'Method A:(RAG) MCP Text2Cypher', value: 'method2' }
    
  ];

  handleInput(event) {
    this.userInput = event.target.value;
  }

  handleModeChange(event) {
    this.selectedMode = event.detail.value;
  }

  async handleSubmit() {
    try {
      const result = await getMcpResponse({ input: this.userInput, mode: this.selectedMode });
      this.response = JSON.stringify(result, null, 2);
    } catch (error) {
      this.response = 'Error: ' + error.body.message;
    }
  }
}