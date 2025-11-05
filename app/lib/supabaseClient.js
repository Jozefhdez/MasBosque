import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://tlsznxdeffgtrgszjtip.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_F_R7RxLOp4wwBqn9KkpspQ_ChMI_DTq'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
