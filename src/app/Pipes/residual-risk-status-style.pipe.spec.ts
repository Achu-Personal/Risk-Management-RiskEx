import { ResidualRiskStatusStylePipe } from './residual-risk-status-style.pipe';

fdescribe('ResidualRiskStatusStylePipe', () => {
  let pipe: ResidualRiskStatusStylePipe;

  beforeEach(() => {
    pipe = new ResidualRiskStatusStylePipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return green-cell for Low risk', () => {
    expect(pipe.transform('Low')).toBe('green-cell');
  });

  it('should return yellow-cell for Medium risk', () => {
    expect(pipe.transform('Medium')).toBe('yellow-cell');
  });

  it('should return red-cell for High risk', () => {
    expect(pipe.transform('High')).toBe('red-cell');
  });

  it('should return empty string for unknown risk', () => {
    expect(pipe.transform('Unknown')).toBe('');
  });
});
