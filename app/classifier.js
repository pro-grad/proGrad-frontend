import { pipeline, env } from "@huggingface/transformers";

env.allowLocalModels = false;
env.backends.onnx.wasm.numThreads = 1;

class TextGenerationPipeline {
  static task = "text-generation";
  static model = "onnx-community/SmolLM-135M-ONNX";
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      this.instance = await pipeline(this.task, this.model, {
        progress_callback,
      });
    }
    return this.instance;
  }
}

// Pre-load model on worker start
(async () => {
  self.postMessage({ status: "status", message: "Loading WASM model..." });
  try {
    await TextGenerationPipeline.getInstance();
    self.postMessage({ status: "status", message: "Model Ready" });
  } catch (err) {
    self.postMessage({ status: "status", message: "Failed to load model" });
  }
})();

self.addEventListener("message", async (event) => {
  const { text } = event.data;
  if (!text) return;

  self.postMessage({ status: "status", message: "Generating..." });

  try {
    const generator = await TextGenerationPipeline.getInstance();
    const output = await generator(text, { max_new_tokens: 50 });

    self.postMessage({
      status: "complete",
      output: output[0].generated_text,
    });
    self.postMessage({ status: "status", message: "Model Ready" });
  } catch (error) {
    self.postMessage({ status: "status", message: "Error generating response" });
  }
});