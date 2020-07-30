const Koa = require('koa')
const bodyParser = require('koa-body')
const Router = require("koa-router");
const render = require('koa-ejs')
const path = require('path')
const Task = require("./models/Task");

const app = new Koa()
const router = new Router();
app.use(bodyParser())

render(app, {
    root: path.join(__dirname, 'views'),
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: false
})

app.use(router.routes())
app.use(router.allowedMethods())
 
router.get('/tsk',async ctx => {
  const tasks = await Task.findAll();
  await ctx.render("index", {
            title: "My tasks",
            tasks: tasks
        })
});

router.get("/tsk/add", async (ctx) => {
  await ctx.render("add", {
    title: "Add new",
  });
});

router.post('/tsk/add',add)
async function add(ctx){
    const body = ctx.request.body
    const task = body.task
    await Task.create({ task_name:task })
    ctx.redirect('/')
}


router.get('/tsk/:id',async ctx => {
  const tasks = await Task.findAll({
    where: {id: ctx.params.id }
  });
  await ctx.render("show", {
            title: "Task" + ' ' + tasks[0].id,
            tasks: tasks
        })
});
router.get("/tsk/:id/edit", async (ctx) => {
  const tasks = await Task.findAll({
    where: {id: ctx.params.id}
  });
  await ctx.render("edit", {
    title: "Edit" + ' task ' + tasks[0].id,
    tasks: tasks
  });
});
// router.put('/tsk/:id/edit',async ctx => { //!!!!!!!!!!!!!!!!!!!!!!!!!!!!
//     await Task.update({ task_name:ctx.request.body.task_name },
//       {where: {id: ctx.params.id}}
//       )
//     ctx.redirect('/tsk')
    
// });
router.put("/tsk/:id/edit",update)
async function update(ctx){
    const body = ctx.request.body
    const task = body.task
    await Task.update({ task_name:task })
    ctx.redirect('/')
}
router.delete('/tsk/:id',async ctx => { 
  await Task.destroy({where: {id: ctx.params.id}})
  ctx.redirect('/tsk')
  
});

router.get('/tsk/test', async ctx => ctx.body = 'test')
app.listen(5000, ()=>{
    console.log("Run on 5000");
})