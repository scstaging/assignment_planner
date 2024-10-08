<!-- src/routes/Login.svelte -->
<script>
    import { supabase } from '$lib/supabaseClient';
  
    let email = '';
    let password = '';
    let errorMessage = '';
  
    const handleLogin = async () => {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        errorMessage = error.message;
      } else {
        // Redirect to admin portal
        window.location.href = '/admin';
      }
    };
  </script>
  
  <form on:submit|preventDefault={handleLogin}>
    <input type="email" bind:value={email} placeholder="Email" required />
    <input type="password" bind:value={password} placeholder="Password" required />
    <button type="submit">Login</button>
    {#if errorMessage}
      <p>{errorMessage}</p>
    {/if}
  </form>
  