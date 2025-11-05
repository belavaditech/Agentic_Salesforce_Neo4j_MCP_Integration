# Agentic approach to Salesforce–Neo4j Integration using MCP
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
  

## Table of Contents  
- [Project Overview](#project-overview)  
- [Key Technologies](#key-technologies)  
- [Architecture & Methods](#architecture--methods)  
  - Agentic method: GraphRAG Pipeline  
  - Regular method: Retriever RAG  
  
- [Demo / Screenshots](#demo--screenshots)  
- [Getting Started](#getting-started)  
  - Prerequisites  
  - Setup & Installation  

- [License](#license)  
- [Contact](#contact)  

---

## Project Overview  
This repository demonstrates an Agentic approach to integration between **Salesforce** (CRM platform) and **Neo4j** (graph-database) using the **Model Context Protocol (MCP)**, incorporating the concept of **GraphRAG** (Graph-based Retrieval-Augmented Generation).  

This project showcases integration that leverage Apex, LWC, and Named Credentials on Salesforce side, and GraphRag pipeline functions, retrievers  on Neo4j side via an MCP layer  

---

## Key Technologies  
- **Salesforce**: Apex, LWC, Named Credentials, Flow automation  
- **Neo4j**: Graph modelling (nodes, relationships, properties), Cypher query language  
- **Model Context Protocol (MCP)**: Standardized protocol connecting AI models to tools and databases  
- **GraphRAG**: Combines vector embeddings + graph context for richer retrieval and insights  

---

## Architecture & Methods  

### Agentic method : GraphRAG Pipeline  
**Flow:** Salesforce → GraphRAG Pipeline → Neo4j  
**Highlights:** 

Provides integrated pipeline for Retriever, llm, database,  context; 

Combines vector + graph context; 

Provides context-rich insights for knowledge graph use cases.  

![Agentic method – GraphRag Pipeline ](./imgs/agenticmethod.jpg)


### Regular Method : Retriever RAG  
**Flow:** Salesforce → Gateway -> Retriever → Neo4j  
**Highlights:** Requires separate integration of of various components of RAG

![Method 2 – RAG with GraphRag Retriever](./imgs/regularmethod.jpg)



**References used:**

https://neo4j.com/docs/neo4j-graphrag-python/current/user_guide_kg_builder.html (KG pipeline)

https://github.com/neo4j-product-examples/graphrag-python-examples (Example used)

https://neo4j.com/blog/genai/what-is-graphrag/ (Documentation)

https://neo4j.com/blog/news/graphrag-python-package/ (Explanation of example)

https://neo4j.com/docs/neo4j-graphrag-python/current/user_guide_rag.html


## 🏗 Architecture Overview

| Layer | Component |
|-------|----------|
| UI Layer | **Lightning Web Component (LWC)** |
| Backend (Salesforce) | **Apex Controller → Named Credentials → HTTP Callouts** |
| Gateway | **Node.js MCP Client Gateway (Port 9005)** |
| MCP Services | **Python MCP Server (Port 8005)** exposing tools
| Data Layer | **Neo4j Graph Database** |

- LWC sends requests → Apex  
- Apex uses **Named Credentials + ngrok HTTPS endpoint**  
- Node.js Gateway converts Salesforce HTTP into MCP requests  
- Python MCP Server hosts tools that translate or execute Cypher


## 🎛 Why Apex + Named Credentials?

Salesforce **does not allow direct HTTP calls from LWC** due to security policy. So:

- **Apex makes the callout**
- **Named Credential exposes the gateway URL**
- **Ngrok provides temporary HTTPS URL**, because Named Credentials **do not accept HTTP**

![Named credential to access Gateway)](./imgs/namedcredential.jpeg)

---
## 🌍 Testing via cURL

**Local testing** 
```bash
curl -s -X POST http://localhost:8005/mcp -H "Content-Type: application/json" -H "Accept: application/json,text/event-stream" -d '{
  "jsonrpc":"2.0","id":3,"method":"tools/call",
  "params":{"name":"run_vector_query","arguments":{"question":"Summarize communication challenges between patients and clinicians"}}
}'


```

**Remote testing**
```bash
curl -s -X POST https://d001d4abfaa9.ngrok-free.app/mcp -H "Content-Type: application/json" -H "Accept: application/json,text/event-stream"  -d  @biomolecule.json



```

**Input JSON (`biomolecule.json`)**
```json
{
  "jsonrpc":"2.0","id":4,"method":"tools/call",
  "params":{"name":"run_graphrag_search_withcontext","arguments":{"question":"Relate biomolecule findings to lupus clinical guidelines"}}
}

```
---

## Demo / Screenshots  

1. **Salesforce Application :** 

![Application ](./imgs/application.jpeg)


2. **Vector vs Vector cypher :** With Agentic GraphRag comparison

![Vector vs Vector cypher ](./imgs/agentic.jpeg)

---

## Getting Started  

### Prerequisites  
- Salesforce Developer Org or Sandbox  
- Neo4j database (local or Aura)  
- Node.js for MCP Gateway or Python for MCP Server  
- Basic knowledge of Apex, LWC, Cypher  

### Setup & Installation  
```bash
git clone https://github.com/belavaditech/Agentic_Salesforce_Neo4j_MCP_Integration

cd Agentic_Salesforce_Neo4j_MCP_Integration
```

1. Configure Neo4j connection credentials.  
2. Setup MCP server (Provided ) with Neo4j details.  
3. Setup Gateway server (Provided)
4. Create 2 Named Credentials in Salesforce for secure endpoint calls.  
5. Deploy provided Apex classes (one for MCP server endpoint 8005, another for Gateway endpoint access 9005)
6. Deploy LWC components (provided).  
7. Configure the LWC components in your application



---

## Configuration  

Create a `.env` file for your environment:  
```env
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password
MCP_PORT=8005

```

In Salesforce:  
- Set up a **Named Credential** pointing to the MCP Gateway endpoint.  
- Assign permission sets for API calls from Apex.  




---

## License  
This project is licensed under the MIT License — see [LICENSE](LICENSE).  

---

## Contact  
**Author:** Ramesh BN  

---


