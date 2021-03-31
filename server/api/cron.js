var cron = require('node-cron')

let task = cron.schedule('1 * * * *', () => {
  console.log('running a task every minute')
})

task.start()

/*
Allowed fields
 # ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
 */

/*
 Allowed values
field	  value
second	0-59
minute	0-59
hour	  0-23
day of month	1-31
month	1-12 (or names)
day of week	0-7 (or names, 0 or 7 are sunday)

 */
