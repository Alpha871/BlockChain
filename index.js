

function toHex(valuess) {
	return valuess.toString(16);
}

class Block {

	constructor(trans, nonce, prevBlockHash) {
  	this.trans = trans;
    this.nonce = nonce;
    this.prevBlockHash = prevBlockHash;
		this.timestamp = Date.now();
  }
  
  getCrypt() {
  	return CryptoJS.SHA256(this.trans.toString()).toString();
  }
  
  getHash() {
  	return CryptoJS.SHA256(
    	+ this.prevBlockHash
      + this.getCrypt()
      + toHex(this.timestamp)
      + toHex(this.nonce)
    ).toString();
  }
  
  renderingElment() {
		document.querySelector('#blockhash').innerHTML = this.getHash();
    document.querySelector('#prevhash').innerHTML = this.prevBlockHash;
    document.querySelector('#date').innerHTML = this.timestamp;
    document.querySelector('#trans').innerHTML = this.trans.toString().replace(/,/g, '<br/>');
  }
}

class Blockchain {

	constructor(currentBlock) {
		this.blocks = new Array();
    this.blocks[currentBlock.getHash()] = currentBlock;
    console.log(currentBlock.getHash())
    
    this.rendering(currentBlock);
  }
  
  mineNewBlock(trans) {
		let nonce = Math.floor(Math.random() * 4294967294) + 1;
    let minedBlock = new Block(trans, nonce, this.getLastBlock().getHash());
    this.blocks[minedBlock.getHash()] = minedBlock;
    
    this.rendering(minedBlock);
  }
  
  rendering(newBlock) {
    let node = document.querySelector('#blockchain');
    
    let blocNode = document.createElement('div');
    let lastNode = node.lastChild;
    
		blocNode.classList.add('block');
    blocNode.setAttribute('onClick', 'blockchain.getLastBlock(this)');
    blocNode.onclick = (function(node) {
    	this.selectBlock(newBlock.getHash(), node.srcElement);
    }).bind(this);
    
    node.appendChild(blocNode);
    
    if (!newBlock.prevBlockHash) {
    	newBlock.renderingElment();
      blocNode.classList.add('selected');
      return;
    }
    
		lastNode.classList.add('barblock');		
  }
  
  selectBlock(blockHash, node) {
  	let selectedNode = document.querySelector('.selected');
    selectedNode.classList.remove('selected');
    node.classList.add('selected');
    this.blocks[blockHash].renderingElment();
  }
  
  getLastBlock() {
  	let key = Object.keys(this.blocks)[Object.keys(this.blocks).length - 1];
  	return this.blocks[key];
  }
  
	prevBlockFrom(currentBlock) {
  	return this.blocks[currentBlock.prevBlockHash];
  }
}

let currentBlock = new Block(['Current', 'block'], 1, null);

let blockchain = new Blockchain(currentBlock);

let generator;

function genTrans() {
  let nbTrs = Math.floor(Math.random() * 10);
  let trans = new Array(nbTrs);
  for (let i = 0; i < nbTrs; i++) {
  	let n = Math.floor((Math.random() * 1000000000) + 1);
    trans[i] = CryptoJS.SHA256(n + '').toString();
  }
  return trans;
}


document.querySelector('#btn-next').onclick = function() {
	blockchain.mineNewBlock(genTrans());
}
