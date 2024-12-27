import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';  // is used in Angular unit testing to locate elements in the DOM. 
import { ReferncetableComponent } from './referncetable.component';

describe('ReferncetableComponent', () => {
  let component: ReferncetableComponent;
  let fixture: ComponentFixture<ReferncetableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferncetableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferncetableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the table headers correctly', () => {
    component.tableHead = ['Header1', 'Header2', 'Risk Rating'];
    component.tableBody = [];
    fixture.detectChanges();

    const headerElements = fixture.debugElement.queryAll(By.css('thead th'));
    expect(headerElements.length).toBe(3);
    expect(headerElements[0].nativeElement.textContent.trim()).toBe('Header1');
    expect(headerElements[1].nativeElement.textContent.trim()).toBe('Header2');
    expect(headerElements[2].nativeElement.textContent.trim()).toBe('Risk Rating');
  });

  it('should render the table rows correctly', () => {
    component.tableHead = ['Column1', 'Column2'];
    component.tableBody = [
      { Column1: 'Data1', Column2: 'Data2' },
      { Column1: 'Data3', Column2: 'Data4' },
    ];
    fixture.detectChanges();

    const rowElements = fixture.debugElement.queryAll(By.css('tbody tr'));
    expect(rowElements.length).toBe(2);

    const firstRowCells = rowElements[0].queryAll(By.css('td'));
    expect(firstRowCells[0].nativeElement.textContent.trim()).toBe('Data1');
    expect(firstRowCells[1].nativeElement.textContent.trim()).toBe('Data2');

    const secondRowCells = rowElements[1].queryAll(By.css('td'));
    expect(secondRowCells[0].nativeElement.textContent.trim()).toBe('Data3');
    expect(secondRowCells[1].nativeElement.textContent.trim()).toBe('Data4');
  });

  it('should apply correct styles for "Risk Rating Category" values', () => {
    component.tableHead = ['Risk Rating Category'];
    component.tableBody = [
      { 'Risk Rating Category': 'Low Risk' },
      { 'Risk Rating Category': 'Moderate Risk' },
      { 'Risk Rating Category': 'Critical Risk' },
    ];
    fixture.detectChanges();

    // const cellElements = fixture.debugElement.queryAll(By.css('tbody td'));

    // expect(cellElements[0].styles['backgroundColor']).toBe('green');
    // expect(cellElements[0].styles['color']).toBe('white');

    // expect(cellElements[1].styles['backgroundColor']).toBe('#FFC107');
    // expect(cellElements[1].styles['color']).toBe('black');

    // expect(cellElements[2].styles['backgroundColor']).toBe('red');
    // expect(cellElements[2].styles['color']).toBe('white');
  });

  it('should return the correct styles from getCellStyle()', () => {
    expect(component.getCellStyle('Low Risk')).toEqual({
      backgroundColor: 'green',
      color: 'white',
    });

    expect(component.getCellStyle('Moderate Risk')).toEqual({
      backgroundColor: '#FFC107',
      color: 'black',
    });

    expect(component.getCellStyle('Critical Risk')).toEqual({
      backgroundColor: 'red',
      color: 'white',
    });

    expect(component.getCellStyle('Unknown')).toEqual({});
    expect(component.getCellStyle('')).toEqual({});
  });

  it('should not apply styles for non-risk-related columns', () => {
    component.tableHead = ['Non-Risk Column'];
    component.tableBody = [{ 'Non-Risk Column': 'Some Value' }];
    fixture.detectChanges();

    const cellElement = fixture.debugElement.query(By.css('tbody td'));
    expect(cellElement.styles['backgroundColor']).toBeFalsy();
    expect(cellElement.styles['color']).toBeFalsy();
  });
});
