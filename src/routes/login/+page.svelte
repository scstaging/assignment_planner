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
      // IMPORTANT: Append fromLogin=true to the admin route
      window.location.href = '/admin?fromLogin=true';
    }
  };
</script>

<div class="login-container">
  <form class="login-form" on:submit|preventDefault={handleLogin}>
    <h1 class="title">Login</h1>
    <input
      class="input"
      type="email"
      bind:value={email}
      placeholder="Email"
      required
    />
    <input
      class="input"
      type="password"
      bind:value={password}
      placeholder="Password"
      required
    />
    <button class="button" type="submit">Login</button>

    {#if errorMessage}
      <p class="error-message">{errorMessage}</p>
    {/if}
  </form>
</div>

<style>
  /* Container */
  .login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    font-family: Arial, sans-serif;
    color: #333;
  }

  .login-form {
    background-color: #fff;
    padding: 2rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.06);
    display: flex;
    flex-direction: column;
    width: 300px;
  }

  .title {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 600;
    text-align: center;
    color: #444;
  }

  .input {
    padding: 0.5rem;
    font-size: 1rem;
    margin-bottom: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 0.6rem 1rem;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;
    transition: background-color 0.2s ease;
  }

  .button:hover {
    background-color: #0056b3;
  }

  .error-message {
    margin-top: 1rem;
    color: #cc0000;
    font-weight: 500;
    background-color: #ffe5e5;
    padding: 0.5rem;
    border-radius: 4px;
  }
</style>
