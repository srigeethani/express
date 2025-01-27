// const express = require("express");
// const app = express();
// const port = 3000;



// const singledata = [
//     { id: 1, name: "geethu", address: "xyz" },
//     { id: 2, name: "sree", address: "abc" },
//     { id: 3, name: "magil", address: "rst" }
// ];

// app.get("/api/singledata", (req, res) => {
//     const { name,id } = req.query;

//     if (name) {
//         const result = singledata.find(item => item.name === name&& item.id===id);

//         if (result) {
//             return res.json(result); 
//          } else {
//             return res.status(404).json({ error: "Data not found" }); 
//         }
//     }


//     res.status(400).json({ error: "error" });
// });

// app.listen(port, () => {
//     console.log(`Server is running on http://localhost:${port}`);
// });

 const express = require("express");
 const mongoose=require("mongoose")
 const app = express();
const port = 3000;

app.use(express.json())

const mongourl="mongodb://localhost:27017/local"
mongoose.connect(mongourl)
.then(() => {
    console.log("connected to database");
    app.listen(port,()=>{
        console.log(`server is running on http://localhost:${port}`)
    })
})
.catch((err) => {
    console.log("error connecting to database", err);
    });
const expenseSchema=new mongoose.Schema({
    id:{type:String,required:true,unique:true},
    title:{type:String,required:true},
    amount:{type:Number,required:true},
})
const expensemodel=mongoose.model("expense",expenseSchema);
app.get("/api/expense",async(req,res)=>{
    try{
        const expense=await expensemodel.find();
        res.status(200).json(expense);
    }catch(error){
            res.status(500).json({error:"failed to connect"})
            
        }
    });

    const{v4:uuidv4}=require("uuid");
    app.post("/api/expense",async(req,res)=>{
        let body="";
        req.on("data",(chunk)=>{
            body+=chunk;
            });
            req.on("end",async()=>{
                const data =JSON.parse(body);
                const newexpense=new expensemodel({
                    id:uuidv4(),
                    title:data.title,
                    amount:data.amount,
                });
                const savedExpenses=await newexpense.save();
                res.status(200).json(savedExpenses);

            });
    });

//update
app.put("/api/expense/:id",async(req,res)=>{
    const {id}=req.params;
    const {title,amount}=req.body;
    console.log(title)
    try{
        const updatedExpense=await expensemodel.findOneAndUpdate(
            {id},
            {title,amount}
        )
        if(updatedExpense){
            return res.status(400).json({message:"Expense not found"});
        }
        res.status(200).json({title,amount});
    }
    catch(error){
        res.status(500).json({message:"Error in updating expense"});
   }
})

//delete
 app.delete("/api/expense/:id",async(req,res)=>{
     const {id}=req.params;
     try{
         const deletedExpense=await expensemodel.findOneAndDelete(id);
         if(!deletedExpense){
             return res.status(400).json({message:"Expense not found"});
             }
             res.status(200).json({message:"Expense deleted successfully"});
             }
             catch(error){
                 res.status(500).json({message:"Error in deleting expense"});
                 }
})
