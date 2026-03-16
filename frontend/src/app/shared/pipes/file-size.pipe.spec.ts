import { FileSizePipe } from './file-size.pipe';

describe('FileSizePipe', () => {
  let pipe: FileSizePipe;

  beforeEach(() => {
    pipe = new FileSizePipe();
  });

  it('should return "0 B" for 0 bytes', () => {
    expect(pipe.transform(0)).toBe('0 B');
  });

  it('should return "1023 B" for 1023 bytes', () => {
    expect(pipe.transform(1023)).toBe('1023 B');
  });

  it('should return "1 KB" for 1024 bytes', () => {
    expect(pipe.transform(1024)).toBe('1 KB');
  });

  it('should return "1.0 MB" for 1 048 576 bytes', () => {
    expect(pipe.transform(1_048_576)).toBe('1.0 MB');
  });

  it('should return "1.5 MB" for 1 572 864 bytes', () => {
    expect(pipe.transform(1_572_864)).toBe('1.5 MB');
  });
});
