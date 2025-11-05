import { LightningElement, track } from 'lwc';
import callMcpTool from '@salesforce/apex/McpGatewayController.callMcpTool';

export default class GraphRagReportCompare extends LightningElement {
  @track question = 'Summarize communication challenges between patients and clinicians';
  @track loading = false;
  @track error = null;
  @track vectorDisplay = '';
  @track hybridDisplay = '';
  @track showResults = false;

  handleQuestionChange(e) {
    this.question = e.target.value;
  }

async runVector() {
    await this._run('run_graphrag_search_vector_withcontext', 'vector');
  }

  async runHybrid() {
    await this._run('run_graphrag_search_hybrid_withcontext', 'hybrid');
  }


  async _run(toolName, mode) {
    this.loading = true;
    this.error = null;

    try {
      const res = await callMcpTool({
        toolName: toolName,
        argumentsJson: JSON.stringify({ question: this.question })
      });

      const text = this._extractTextResponse(res);
      const limitedText = this._truncate(text, 8000);

      if (mode === 'vector') {
        this.vectorDisplay = limitedText;
      } else {
        this.hybridDisplay = limitedText;
      }

      this.showResults = true;
    } catch (err) {
      this.error = err?.body?.message || JSON.stringify(err);
    } finally {
      this.loading = false;
    }
  }

  _extractTextResponse(res) {
    try {
      // Case 1: The text is in structuredContent
      const text =
        res?.result?.structuredContent?.vectorresponse ||
        res?.result?.structuredContent?.vectorcypherresponse ||
        res?.result?.structuredContent?.text ||
        res?.result?.content?.[0]?.text ||
        res?.vectorresponse ||
        res?.vectorcypherresponse ||
        '';

      // Case 2: The text might be a JSON string — try to parse and get inner text
      if (typeof text === 'string') {
        try {
          const parsed = JSON.parse(text);
          if (parsed.vectorresponse) return parsed.vectorresponse;
          if (parsed.vectorcypherresponse) return parsed.vectorcypherresponse;
          if (parsed.text) return parsed.text;
          return text;
        } catch {
          // Not JSON — use as-is
          return text;
        }
      }

      return JSON.stringify(text, null, 2);
    } catch (e) {
      return 'Error parsing response: ' + e.message;
    }
  }

  _truncate(txt, limit) {
    return txt.length > limit ? txt.substring(0, limit) + '\n... (truncated)' : txt;
  }
}



