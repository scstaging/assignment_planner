<!-- src/routes/Admin.svelte -->
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
      const fileName = `${Date.now()}_${iconFile.name}`;
      const { data, error } = await supabase.storage
        .from('icons')
        .upload(`${fileName}`, iconFile, {
          cacheControl: '3600',
          upsert: false,
        });
      if (error) {
        throw error;
      }
      return data.path;
    };
  
    const handleAddAssignment = async () => {
      try {
        let iconPath = '';
        if (newIconFile) {
          iconPath = await uploadIconFile(newIconFile);
        }
        const { error } = await supabase.from('assignments').insert([
          {
            title: newTitle,
            doc_id: newDocId,
            icon_url: iconPath
              ? `https://vvjogjaiiuqsklqkwlrj.supabase.co/storage/v1/object/public/icons/${iconPath}`
              : null,
          },
        ]);
        if (error) {
          throw error;
        }
        successMessage = 'Assignment added successfully!';
        newTitle = '';
        newDocId = '';
        newIconFile = null;
        await fetchAssignments();
      } catch (error) {
        errorMessage = error.message;
      }
    };
  
    const handleUpdateAssignment = async (assignment) => {
      try {
        let iconPath = assignment.icon_url;
        if (assignment.newIconFile) {
          // Delete old icon if it exists
          if (assignment.icon_url) {
            const oldIconPath = assignment.icon_url.replace(
              `https://vvjogjaiiuqsklqkwlrj.supabase.co/storage/v1/object/public/`,
              ''
            );
            await supabase.storage.from('icons').remove([oldIconPath]);
          }
          // Upload new icon
          const uploadedPath = await uploadIconFile(assignment.newIconFile);
          iconPath = `https://vvjogjaiiuqsklqkwlrj.supabase.co/storage/v1/object/public/${uploadedPath}`;
        }
  
        const { error } = await supabase
          .from('assignments')
          .update({
            title: assignment.title,
            doc_id: assignment.doc_id,
            icon_url: iconPath,
          })
          .eq('id', assignment.id);
        if (error) {
          throw error;
        }
        successMessage = 'Assignment updated successfully!';
        await fetchAssignments();
      } catch (error) {
        errorMessage = error.message;
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
          const iconPath = assignment.icon_url.replace(
            `https://vvjogjaiiuqsklqkwlrj.supabase.co/storage/v1/object/public/`,
            ''
          );
          await supabase.storage.from('icons').remove([iconPath]);
        }
        successMessage = 'Assignment deleted successfully!';
        await fetchAssignments();
      } catch (error) {
        errorMessage = error.message;
      }
    };
  </script>
  
  {#if user}
    <h1>Admin Portal</h1>
  
    <!-- Success and error messages -->
    {#if errorMessage}
      <p style="color: red;">{errorMessage}</p>
    {/if}
    {#if successMessage}
      <p style="color: green;">{successMessage}</p>
    {/if}
  
    <!-- Form to add a new assignment -->
    <h2>Add New Assignment</h2>
    <form on:submit|preventDefault={handleAddAssignment}>
      <input type="text" bind:value={newTitle} placeholder="Title" required />
      <input type="text" bind:value={newDocId} placeholder="Google Doc ID" required />
      <input
        type="file"
        accept=".png"
        on:change={(e) => (newIconFile = e.target.files[0])}
        required
      />
      <button type="submit">Add Assignment</button>
    </form>
  
    <hr />
  
    <!-- List of assignments -->
    <h2>Manage Assignments</h2>
    {#each assignments as assignment (assignment.id)}
      <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
        <form
          on:submit|preventDefault={() => handleUpdateAssignment(assignment)}
        >
          <!-- Title -->
          <label>
            Title:
            <input type="text" bind:value={assignment.title} required />
          </label>
          <!-- Google Doc ID -->
          <label>
            Google Doc ID:
            <input type="text" bind:value={assignment.doc_id} required />
          </label>
          <!-- Current Icon -->
          {#if assignment.icon_url}
            <img src="{assignment.icon_url}" alt="{assignment.title}" width="100" />
          {/if}
          <!-- Upload New Icon -->
          <label>
            Update Icon:
            <input
              type="file"
              accept=".png"
              on:change={(e) => (assignment.newIconFile = e.target.files[0])}
            />
          </label>
          <!-- Update and Delete Buttons -->
          <button type="submit">Update</button>
          <button
            type="button"
            on:click={() => handleDeleteAssignment(assignment)}
          >
            Delete
          </button>
        </form>
      </div>
    {/each}
  
    <!-- Logout Button -->
    <button
      on:click={async () => {
        await supabase.auth.signOut();
        window.location.href = '/';
      }}
    >
      Logout
    </button>
  {/if}
  