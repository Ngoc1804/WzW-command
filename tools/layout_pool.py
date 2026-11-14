"""Exact defs sharing for transport only; canonical layout source stays readable/compatible."""
import copy,hashlib

def pack(layouts):
 out=copy.deepcopy(layouts);defs={}
 for sizes in out.values():
  for art in sizes.values():
   if art.get('defs'):
    value=art.pop('defs');key=hashlib.sha256(value.encode()).hexdigest();defs[key]=value;art['defsRef']=key
 return {'defs':defs,'layouts':out}

def unpack(payload):
 out=copy.deepcopy(payload['layouts'])
 for sizes in out.values():
  for art in sizes.values():
   if 'defsRef'in art:art['defs']=payload['defs'][art.pop('defsRef')]
 return out
