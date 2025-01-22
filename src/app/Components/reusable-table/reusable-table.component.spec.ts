// import { ComponentFixture, TestBed } from '@angular/core/testing';

// import { ReusableTableComponent } from './reusable-table.component';
// import { By } from '@angular/platform-browser';

// describe('ReusableTableComponent', () => {
//   let component: ReusableTableComponent;
//   let fixture: ComponentFixture<ReusableTableComponent>;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [ReusableTableComponent]
//     })
//     .compileComponents();

//     fixture = TestBed.createComponent(ReusableTableComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });
//   it('should initialize rowKeys based on tableData', () => {
//     component.tableData = [
//       { name: 'John', age: 30 },
//       { name: 'Jane', age: 25 },
//     ];
//     component.ngOnInit();
//     expect(component.rowKeys).toEqual(['name', 'age']);
//   });
//   it('should initialize rowKeys as empty if tableData is empty', () => {
//     component.tableData = [];
//     component.ngOnInit();
//     expect(component.rowKeys).toEqual([]);
//   });

//   // Test table rendering
//   it('should display table with data', () => {
//     component.tableHeaders = ['Name', 'Age'];
//     component.tableData = [
//       { name: 'John', age: 30 },
//       { name: 'Jane', age: 25 },
//     ];
//     fixture.detectChanges();

//     const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
//     expect(rows.length).toBe(3);
//   });

//   it('should display "No data available" if tableData is empty', () => {
//     component.tableHeaders = ['Name', 'Age'];
//     component.tableData = [];
//     fixture.detectChanges();

//     const noDataText = fixture.debugElement.query(By.css('.text-center')).nativeElement;
//     expect(noDataText.textContent).toContain('No data available');
//   });

//   // Test dynamic column rendering
//   it('should render the correct number of columns based on tableHeaders', () => {
//     component.tableHeaders = ['Name', 'Age'];
//     component.tableData = [
//       { name: 'John', age: 30 },
//       { name: 'Jane', age: 25 },
//     ];
//     fixture.detectChanges();

//     const headerCells = fixture.debugElement.queryAll(By.css('thead th'));
//     expect(headerCells.length).toBe(2);
//   });

//   it('should render table data in correct columns', () => {
//     component.tableHeaders = ['Name', 'Age'];
//     component.tableData = [
//       { name: 'John', age: 30 },
//       { name: 'Jane', age: 25 },
//     ];
//     fixture.detectChanges();

//     const firstRowCells = fixture.debugElement.queryAll(By.css('tbody tr:first-child td'));
//     expect(firstRowCells[0].nativeElement.textContent).toBe('John');
//     expect(firstRowCells[1].nativeElement.textContent).toBe('30');
//   });

//   // Test action column display (approve/reject buttons)
//   it('should display action column when IsActionRequiered is true and IsUser is false', () => {
//     component.IsActionRequiered = true;
//     component.IsUser = false;
//     component.tableHeaders = ['Name', 'Age'];
//     component.tableData = [
//       { name: 'John', age: 30 },
//     ];
//     fixture.detectChanges();

//     const actionColumn = fixture.debugElement.queryAll(By.css('.icon-approve, .icon-reject'));
//     expect(actionColumn.length).toBe(2); // Approve and Reject icons
//   });

//   it('should display status and toggle when IsActionRequiered is true and IsUser is true', () => {
//     component.IsActionRequiered = true;
//     component.IsUser = true;
//     component.tableHeaders = ['Name', 'Age'];
//     component.tableData = [
//       { name: 'John', age: 30, toggleState: true },
//     ];
//     fixture.detectChanges();

//     const toggleStatus = fixture.debugElement.query(By.css('.toggle-background p')).nativeElement;
//     expect(toggleStatus.textContent).toBe('Active');
//   });

//   // Test click events
//   // it('should emit rowClick event when a row is clicked', () => {
//   //   spyOn(component.onclickrow, 'emit');
//   //   component.tableData = [
//   //     { name: 'John', age: 30 },
//   //   ];
//   //   fixture.detectChanges();

//   //   const row = fixture.debugElement.query(By.css('tbody tr'));
//   //   row.triggerEventHandler('click', null);
//   //   expect(component.onclickrow.emit).toHaveBeenCalledWith({ name: 'John', age: 30 });
//   // });

//   // it('should emit approveRisk event when approve button is clicked', () => {
//   //   spyOn(component.approveRisk, 'emit');
//   //   component.tableData = [
//   //     { name: 'John', age: 30 },
//   //   ];
//   //   fixture.detectChanges();

//   //   const approveButton = fixture.debugElement.query(By.css('.icon-approve'));
//   //   approveButton.triggerEventHandler('click', { stopPropagation: () => {} });
//   //   expect(component.approveRisk.emit).toHaveBeenCalledWith({ name: 'John', age: 30 });
//   // });

//   // it('should emit rejectRisk event when reject button is clicked', () => {
//   //   spyOn(component.rejectRisk, 'emit');
//   //   component.tableData = [
//   //     { name: 'John', age: 30 },
//   //   ];
//   //   fixture.detectChanges();

//   //   const rejectButton = fixture.debugElement.query(By.css('.icon-reject'));
//   //   rejectButton.triggerEventHandler('click', { stopPropagation: () => {} });
//   //   expect(component.rejectRisk.emit).toHaveBeenCalledWith({ name: 'John', age: 30 });
//   // });

//   // Test toggle behavior for users
//   it('should toggle row.toggleState correctly', () => {
//     component.IsUser = true;
//     component.tableData = [
//       { name: 'John', age: 30, toggleState: true },
//     ];
//     fixture.detectChanges();

//     const toggleSwitch = fixture.debugElement.query(By.css('input[type="checkbox"]'));
//     toggleSwitch.nativeElement.checked = false;
//     toggleSwitch.triggerEventHandler('change', null);
//     fixture.detectChanges();

//     expect(component.tableData[0].toggleState).toBe(false);
//   });

//   // Test conditional rendering for action column
//   it('should render the correct action column based on IsActionRequiered and IsUser', () => {
//     component.IsActionRequiered = true;
//     component.IsUser = false;
//     fixture.detectChanges();

//     const actionColumn = fixture.debugElement.queryAll(By.css('.icon-approve, .icon-reject'));
//     expect(actionColumn.length).toBe(2); // Approve and Reject icons
//   });

//   // Test table height input
//   it('should set table height based on input height', () => {
//     component.height = '80%';
//     fixture.detectChanges();

//     const tableContainer = fixture.debugElement.query(By.css('.table-container'));
//     expect(tableContainer.nativeElement.style.height).toBe('80%');
//   });
// });
