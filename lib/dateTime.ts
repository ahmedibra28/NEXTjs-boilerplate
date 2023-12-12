import dayjs from 'dayjs'

import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import 'dayjs/locale/es' // Replace 'en' with your desired locale

// Load the Day.js plugins
dayjs.extend(utc)
dayjs.extend(timezone)

const DateTime = dayjs

export default DateTime
