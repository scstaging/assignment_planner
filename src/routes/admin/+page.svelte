<script>
  import { supabase } from '$lib/supabaseClient';
  import { onMount } from 'svelte';

  let user = null;
  let errorMessage = '';
  let successMessage = '';

  let assignments = [];

  // Fields for adding a new assignment
  let newTitle = '';
  let newDocId = '';
  let newIconFile;

  const fetchAssignments = async () => {
    const { data, error } = await supabase.from('assignments').select('*');
    if (error) {
      errorMessage = error.message;
    } else {
      assignments = data;
    }
  };

  onMount(async () => {
    const { data } = await supabase.auth.getSession();
    user = data.session?.user;
    if (!user) {
      // Redirect to login page if not authenticated
      window.location.href = '/login';
    } else {
      // Fetch assignments when authenticated
      await fetchAssignments();
    }
  });

  const uploadIconFile = async (iconFile) => {
    // Generate a unique filename to prevent conflicts
    const uniqueId = Date.now();
    const fileName = `${uniqueId}_${iconFile.name}`;
    const { data, error } = await supabase.storage
      .from('icons')
      .upload(fileName, iconFile, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      throw error;
    }
    // Get the public URL of the uploaded file
    const { data: publicUrlData, error: urlError } = supabase.storage
      .from('icons')
      .getPublicUrl(data.path);

    if (urlError) {
      throw urlError;
    }

    return { path: data.path, url: publicUrlData.publicUrl };
  };

  const handleAddAssignment = async () => {
    try {
      let iconData = null;
      if (newIconFile) {
        iconData = await uploadIconFile(newIconFile);
      }
      const { error } = await supabase.from('assignments').insert([
        {
          title: newTitle,
          doc_id: newDocId,
          icon_url: iconData ? iconData.url : null,
        },
      ]);

      if (error) {
        throw error;
      }

      successMessage = 'Assignment added successfully!';
      errorMessage = '';
      newTitle = '';
      newDocId = '';
      newIconFile = null;
      await fetchAssignments();
    } catch (error) {
      errorMessage = error.message;
      successMessage = '';
    }
  };

  const handleUpdateAssignment = async (assignment) => {
    try {
      let iconUrl = assignment.icon_url;
      if (assignment.newIconFile) {
        // Delete old icon if it exists
        if (assignment.icon_url) {
          // Extract the relative path to the icon
          const url = new URL(assignment.icon_url);
          const iconPath = url.pathname.replace('/storage/v1/object/public/icons/', '');
          await supabase.storage.from('icons').remove([iconPath]);
        }
        // Upload new icon
        const iconData = await uploadIconFile(assignment.newIconFile);
        iconUrl = iconData.url;
      }

      const { error } = await supabase
        .from('assignments')
        .update({
          title: assignment.title,
          doc_id: assignment.doc_id,
          icon_url: iconUrl,
        })
        .eq('id', assignment.id);

      if (error) {
        throw error;
      }

      successMessage = 'Assignment updated successfully!';
      errorMessage = '';
      await fetchAssignments();
    } catch (error) {
      errorMessage = error.message;
      successMessage = '';
    }
  };

  const handleDeleteAssignment = async (assignment) => {
    try {
      // Delete the assignment from the database
      const { error } = await supabase.from('assignments').delete().eq('id', assignment.id);
      if (error) {
        throw error;
      }

      // Delete the icon from storage if it exists
      if (assignment.icon_url) {
        let relativeIconPath = assignment.icon_url.substring(
          assignment.icon_url.lastIndexOf('/') + 1
        );
        await supabase.storage.from('icons').remove([relativeIconPath]);
      }

      successMessage = 'Assignment deleted successfully!';
      errorMessage = '';
      await fetchAssignments();
    } catch (error) {
      errorMessage = error.message;
      successMessage = '';
    }
  };
</script>

{#if user}
  <div class="container">
    <h1 class="title">Admin Portal</h1>

    {#if errorMessage}
      <div class="message error">{errorMessage}</div>
    {/if}
    {#if successMessage}
      <div class="message success">{successMessage}</div>
    {/if}

    <!-- Add New Assignment -->
    <div class="form-section">
      <h2 class="subtitle">Add New Assignment</h2>
      <form class="add-form" on:submit|preventDefault={handleAddAssignment}>
        <input
          class="input"
          type="text"
          bind:value={newTitle}
          placeholder="Title"
          required
        />
        <input
          class="input"
          type="text"
          bind:value={newDocId}
          placeholder="Google Doc ID"
          required
        />
        <input
          class="file-input"
          type="file"
          accept=".png"
          on:change={(e) => (newIconFile = e.target.files[0])}
          required
        />
        <button class="button" type="submit">Add Assignment</button>
      </form>
    </div>

    <!-- Manage Assignments -->
    <div class="assignments-section">
      <h2 class="subtitle">Manage Assignments</h2>
      {#each assignments as assignment (assignment.id)}
        <div class="assignment-card">
          <form on:submit|preventDefault={() => handleUpdateAssignment(assignment)}>
            <label class="label">
              Title:
              <input
                class="input"
                type="text"
                bind:value={assignment.title}
                required
                on:input={() => (assignment = { ...assignment })}
              />
            </label>
            <label class="label">
              Google Doc ID:
              <input
                class="input"
                type="text"
                bind:value={assignment.doc_id}
                required
                on:input={() => (assignment = { ...assignment })}
              />
            </label>
            {#if assignment.icon_url}
              <div class="icon-preview">
                <img src={assignment.icon_url} alt={assignment.title} />
              </div>
            {/if}
            <label class="label">
              Update Icon:
              <input
                class="file-input"
                type="file"
                accept=".png"
                on:change={(e) => {
                  assignment.newIconFile = e.target.files[0];
                  assignment = { ...assignment };
                }}
              />
            </label>
            <div class="buttons">
              <button class="button" type="submit">Update</button>
              <button
                class="button secondary"
                type="button"
                on:click={() => handleDeleteAssignment(assignment)}
              >
                Delete
              </button>
            </div>
          </form>
        </div>
      {/each}
    </div>

    <!-- Logout Button -->
    <button
      class="button logout-button"
      on:click={async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
      }}
    >
      Logout
    </button>
  </div>
{/if}

<style>
  /* Container and layout */
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 1rem;
    font-family: Arial, sans-serif;
    color: #333;
  }

  .title {
    font-size: 2rem;
    margin-bottom: 1rem;
    text-align: center;
    color: #444;
  }

  .subtitle {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    font-weight: 400;
    color: #666;
  }

  .form-section,
  .assignments-section {
    margin-bottom: 2rem;
  }

  /* Messages */
  .message {
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 4px;
    font-weight: 500;
  }
  .error {
    background-color: #ffe5e5;
    color: #cc0000;
  }
  .success {
    background-color: #e5ffe5;
    color: #008000;
  }

  /* Forms and inputs */
  form {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
  }

  .label {
    display: flex;
    flex-direction: column;
    font-weight: 600;
    margin-bottom: 0.3rem;
    color: #555;
  }

  .input,
  .file-input {
    padding: 0.5rem;
    font-size: 1rem;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  /* Card for each assignment */
  .assignment-card {
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 1rem;
    margin-bottom: 1rem;
    border-radius: 5px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  .icon-preview img {
    max-width: 100px;
    margin: 0.5rem 0;
    display: block;
  }

  /* Buttons */
  .buttons {
    display: flex;
    gap: 1rem;
    margin-top: 0.5rem;
  }
  .button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 0.6rem 1rem;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease;
  }
  .button:hover {
    background-color: #0056b3;
  }

  .button.secondary {
    background-color: #dc3545;
  }
  .button.secondary:hover {
    background-color: #b02a37;
  }

  .logout-button {
    margin-top: 2rem;
    width: 100%;
    text-align: center;
  }
</style>
