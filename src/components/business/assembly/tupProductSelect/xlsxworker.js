postMessage({t:"ready"});

onmessage = function (evt) {
  var v;
  try {
      debugger
    v = XLSX.read(evt.data.d, {type: evt.data.b});
    postMessage({t:"xlsx", d:JSON.stringify(v)});
  } catch(e) { postMessage({t:"e",d:e.stack||e}); }
};