import { Orchestrator } from './domain/Orchestrator/Orchestrator';
import { FileService } from './service/FileService';

const fileService = new FileService();

try {
  const fileUri = process.argv[2];
  const orchestrator = new Orchestrator(fileService);

  console.log('Processing your file..');
  orchestrator.initialise(fileUri);

  console.log('Calculating the result..');
  orchestrator.run();

  orchestrator.generateOutput();
  console.log('Your result is available in the output/ directory');
} catch (error) {
  console.log(error);
}
