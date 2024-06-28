class AudioProcessor extends AudioWorkletProcessor {
	constructor() {
		super();
	}

	process(
		inputs: Float32Array[][],
		outputs: Float32Array[][],
		parameters: Record<string, Float32Array>
	) {
		const input = inputs[0];
		if (input) {
			const audioData = input[0];
			if (audioData) {
				this.port.postMessage(audioData);
			}
		}
		return true;
	}
}

registerProcessor("audio-processor", AudioProcessor);
