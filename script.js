</script>

<!-- SUPABASE -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script>
const SUPABASE_URL = "https://clymnqkiarrpatcfuwwt.supabase.co";

const SUPABASE_KEY = "sb_publishable__CQ1qg7_KizhMzPKDaD3tA_TQq6AzsM";

const supabaseClient = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

console.log("Supabase connected:", supabaseClient);
</script>

<script src="script.js"></script>

</body>
</html>
