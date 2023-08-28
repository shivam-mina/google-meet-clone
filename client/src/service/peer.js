class peerService {
  constructor() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              'stun:stun.l.google.com:19302',
              'stun:stun4.l.google.com:19302',
              'stun:stunserver.org:3478',
            ],
          },
        ],
      })
    }
  }
  /**
   *  Create a Offer
   */
  async getOffer() {
    if (this.peer) {
      const offer = await this.peer.createOffer()
      await this.peer.setLocalDescription(new RTCSessionDescription(offer))
      return offer
    }
  }

  /**
   * Answer the offer
   */
  async getAnswer(offer) {
    if (this.peer) {
      try {
        // const remoteOffer = new RTCSessionDescription(offer)
        await this.peer.setRemoteDescription(offer)

        const answer = await this.peer.createAnswer()
        await this.peer.setLocalDescription(answer)

        return answer
      } catch (error) {
        console.error(
          'Error setting remote description or creating answer:',
          error
        )
      }
    }
  }
  /**
   * Accepting call
   */
  async setLocalDesc(ans) {
    if (this.peer) {
      await this.peer.setRemoteDescription(new RTCSessionDescription(ans))
    }
  }
}

const peer = new peerService()
export default peer
