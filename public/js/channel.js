function Channel (name, id) {
  this.name = name;
  this.id = id;
  this.peers = [];
  this.status = 'available';
  this.peerChannel = false; 
};

Channel.prototype.addPeer = function (peerID) {
  if (!this.peerChannel) {
    this.peers.push(peerID);
  }
};

Channel.prototype.removePeer = function (peerID) {
  var peerIndex = -1;
  for (var i = 0; i < this.peers.length; i++) {
    if (this.peers[i].id === peerID) {
      peerIndex = i;
      break;
    }
  }
  this.peer.remove(peerIndex);
};


module.exports = Channel;