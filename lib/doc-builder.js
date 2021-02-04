function subMap(obj) {

  const methods = {
 
    loop(cb) {
      let result = '';
      if (!obj) return result;
      const keys = Object.keys(obj);
      for (let i = 0, l = keys.length; i < l; i++) {
        let key = keys[i];
        if (cb) {
          result += cb(key, obj[key]); 
        }
      }
      return result;
    }
  } 
  return methods;
}

function paramsTable(query) {
  if (!query || Object.keys(query).length === 0) return ''; 
  return `<table>
    <thead>
      <tr>
        <th>Param-Key</th>
        <th>Type</th>
        <th>Descr.</th>
        <th>Example</th>
      </tr>
    </thead>
    <tbody>
  ${subMap(query).loop(
    (k,o) => `<tr>
      <td>${k}</td>
      <td>${o.type}</td>
      <td>${o.description}</td>
      <td>${o.example}</td>
      </tr>` )} 
    </tbody>
  </table>`;
}

function queryTable(query) {
  if (!query || Object.keys(query).length === 0) return ''; 
  return `<table>
    <thead>
      <tr>
        <th>Query key</th>
        <th>Type</th>
        <th>Descr.</th>
        <th>Example</th>
      </tr>
    </thead>
    <tbody>
  ${subMap(query).loop(
    (k,o) => `<tr>
      <td>${k}</td>
      <td>${o.type}</td>
      <td>${o.description}</td>
      <td>${o.example}</td>
      </tr>` )} 
    </tbody>
  </table>`;
}


module.exports = function DocBuilder() {
  return { 
    lines: [],
    addLine(item) {
      if (typeof item === 'function') {
        return this.lines.push(item());
      }
      this.lines.push(item);
    },
    buildHtml() {
      const htmlLines = this.lines.map( item => `
      <tbody> 
        <tr class="${item.method || item.type}">
          <td>
           ${(item.method || item.type).toUpperCase()} 
          </td> 
          <td class="route">
            ${item.fullPath}
          </td>
          <td>
            ${item.name ? item.name : 'anonymous'}
          </td>
          <td class="no-padding">
            ${paramsTable(item.docItem.params)}
          </td>
          <td>
            ${queryTable(item.docItem.query)}
          </td>
        </tr>
      </tbody>`).join('\n');

      return `<!doctype HTML>
        <head>
          <title>Docs</title> 
          <style>
            body, body * {
              font-size: 14.5px; 
              box-sizing: border-box;
              border: 0;
              padding: 0;
              margin: 0;
            }
            body, th, td {
              font-family: Lucinda Console, monospace;
              background-color: black;
              color: #ddd;
            }
            table {
              width: 100%;
              layout: fixed;
              border-collopse: collapse; 
            } 
            tr.router td {
              color: #666;
              border-bottom: 1px dotted #666;
            }
            tr.middleware td {
              color: green; 
            }
            tr.get td {
              color: #ccc;
            }
            tr.post td {
              color: #ccc;
            }
            tr.put td {
              color: #ccc;
            }
            tr.delete td {
              color: #ccc;
            }
            tr.patch td {
              color: #ccc;
            }
            td {
              vertical-align: top; 
              padding: 0.25em 0.5em;
            }
            td.route {
              white-space: nowrap;
            }
            td.no-padding {
              padding: 0; 
            }
            tr.get td:first-child, tr.post td:first-child,
            tr.put td:first-child, tr.delete td:first-child,
            tr.middleware > td:first-child {
              padding-left: 5em;
            }
           </style>
         </head>
         <body>
           <table>
             <thead>
               <tr>
                 <th>
                  Method
                 </th>
                 <th class="route">
                   Route / Mount
                 </th>
                 <th>
                   Handler Function 
                 </th>
                 <th>
                   Url params
                 </th>
                 <th>
                   query 
                 </th>
               </tr>
             </thead>
             ${htmlLines} 
           </table>
         </body>
       <html>
      `;
    }
  }
};
