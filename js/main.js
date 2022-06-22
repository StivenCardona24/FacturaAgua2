//LOGIC

//vue class object
//a public or global variable that will be accessible from index.html
var app = new Vue({
    el: '#app',
    data: {
        list: [
            {id: 1, name: 'test1', stratum: 1, consumption: 1, subsidy: '1 %', fixed_charge: 1, m3p: 1, subtotal: 100, total: 100},
            {id: 2, name: 'test2', stratum: 2, consumption: 2, subsidy: '2 %', fixed_charge: 2, m3p: 2,  subtotal: 200, total: 200}
        ],
        dinamic_objs: [
            {uname: ''}, {ustratum: ''}, {uconsume: ''}, //NOTA: podia hacerse [{attr1, attr2, attr3...}]
            {uFc: ''}, {um3p: ''}, {uSubsidy: ''}, 
            {uSubtotal: ''}, { uTotal: ''}//those values will be accesed as v-text from the index.html file
        ],
        status: '', //The status attribute will hide the report and bill divs and is also linked to the close function
        values: [//this attribute will have a literal objects array and it will be visualized in the main page using index notation
            {
                fixed_charge: 2300,
                m3_value: 250,
                subsidy: '40 %'
            },
            {
                fixed_charge: 3200,
                m3_value: 350,
                subsidy: '30 %'
            },
            {
                fixed_charge: 3900,
                m3_value: 460,
                subsidy: '10 %'
            },
            { average1: '', average2: '', average3: '', itstratum1: '', itstratum2: '', itstratum3: '', ifinaltotal: '' },
            {iname: '', istratum: '', iconsume: '', ifc: '', im3p: '', isubsidy: '', isubtotal: '', itotal: ''}//internal values
        ],

    },
    methods: {
        bill(item){ //bill function
            this.status = true;
            this.dinamic_objs.uname = item.name;
            this.dinamic_objs.ustratum = item.stratum;
            this.dinamic_objs.uconsume = item.consumption;
            this.dinamic_objs.uFc = item.fixed_charge;
            this.dinamic_objs.um3p = item.m3p;
            this.dinamic_objs.uSubsidy = item.subsidy;
            this.dinamic_objs.uSubtotal = item.subtotal;
            this.dinamic_objs.uTotal = item.total;
        },
        report(){
            this.status = false;//when @click="report" is executed it will turn the status into false statement and it will open the report window
            const result1 = this.list.filter(item => item.stratum == 1);
            const result2 = this.list.filter(item => item.stratum == 2);
            const result3 = this.list.filter(item => item.stratum == 3);
            this.values[3].average1 = result1.map(item => item.consumption).reduce((prev, curr) => prev + curr, 0)/result1.length;//average-strtm1
            this.values[3].average2 = result2.map(item => item.consumption).reduce((prev, curr) => prev + curr, 0)/result2.length;//average-strtm2
            this.values[3].average3 = result3.map(item => item.consumption).reduce((prev, curr) => prev + curr, 0)/result3.length;//average-strtm2
            this.values[3].itstratum1 = result1.map(item => item.total).reduce((prev, curr) => prev + curr, 0);//total by stratum 1
            this.values[3].itstratum2 = result2.map(item => item.total).reduce((prev, curr) => prev + curr, 0);//total by stratum 2
            this.values[3].itstratum3 = result3.map(item => item.total).reduce((prev, curr) => prev + curr, 0);//total by stratum 3
            this.values[3].ifinaltotal = this.values[3].itstratum1 + this.values[3].itstratum2 + this.values[3].itstratum3;//total all stratums
        },
        add(){
            if (this.values[4].iname.length < 0 || 
                this.values[4].iconsume <= 0 || this.values[4].iconsume.toString().length < 1 || this.values[4].istratum < 0) {
                alert('The Name, Consumption and Stratum fields cannot be empty');
            }else {
                switch (this.values[4].istratum) {
                    case 1:
                        this.values[4].isubsidy = this.values[0].subsidy;
                        this.values[4].isubtotal = (this.values[4].iconsume * this.values[0].m3_value)+this.values[0].fixed_charge;
                        this.values[4].itotal = this.values[4].isubtotal-(this.values[0].fixed_charge*0.6);
                        this.values[4].ifc = this.values[0].fixed_charge;
                        this.values[4].im3p = this.values[0].m3_value;
                        break;
                    case 2:
                        this.values[4].isubsidy = this.values[1].subsidy;
                        this.values[4].isubtotal = (this.values[4].iconsume * this.values[1].m3_value)+this.values[1].fixed_charge;
                        this.values[4].itotal = this.values[4].isubtotal-(this.values[1].fixed_charge*0.7);
                        this.values[4].ifc = this.values[1].fixed_charge;
                        this.values[4].im3p = this.values[1].m3_value;
                        break;
                    case 3:
                        this.values[4].isubsidy = this.values[2].subsidy;
                        this.values[4].isubtotal = (this.values[4].iconsume * this.values[2].m3_value)+this.values[2].fixed_charge;
                        this.values[4].itotal = this.values[4].isubtotal-(this.values[2].fixed_charge*0.9);
                        this.values[4].ifc = this.values[2].fixed_charge;
                        this.values[4].im3p = this.values[2].m3_value;
                        break;
    
                    default:
                        break;
                }
                this.list.unshift({
                    id: this.list.length + 1,
                    name: this.values[4].iname,
                    stratum: this.values[4].istratum,
                    consumption: this.values[4].iconsume,
                    subsidy: this.values[4].isubsidy,
                    fixed_charge: this.values[4].ifc,
                    m3p: this.values[4].im3p,
                    subtotal: new Intl.NumberFormat('en-IN', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(this.values[4].isubtotal),
                    total: new Intl.NumberFormat('en-IN', {style: 'currency', currency: 'USD', minimumFractionDigits: 2}).format(this.values[4].itotal),
                });
            }
        },
        deleteItem(index){
            if (confirm("Are you sure you want to delete this item?") === true){
                this.list.splice(index, 1);
            }
        },
        close(){
            this.status = "";
        }
    }
    //v-for="i in array" is a vue directive which allows us to iterate an array
    //v-if="condition" is a vue directive which allows us to show or hide elements based on if condition is true or false
    //v-if-else="condition" same as else if in js but with a vue directive
});
