const supabase = require('../utils/supabaseClient');

class OnboardingService {
  /**
   * Save onboarding data to Supabase
   * @param {Object} onboardingData - The onboarding data to save
   * @returns {Promise<Object>} - The saved data with ID
   */
  async saveOnboardingData(onboardingData) {
    try {
      const { data, error } = await supabase
        .from('onboarding')
        .insert([
          {
            linkedin_url: onboardingData.linkedinUrl,
            interests: onboardingData.interests,
            resume_filename: onboardingData.resume.filename,
            resume_original_name: onboardingData.resume.originalName,
            resume_path: onboardingData.resume.path,
            resume_size: onboardingData.resume.size,
            resume_mime_type: onboardingData.resume.mimeType,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error saving onboarding data:', error);
      throw error;
    }
  }

  /**
   * Get onboarding data by ID
   * @param {string} id - The onboarding record ID
   * @returns {Promise<Object>} - The onboarding data
   */
  async getOnboardingById(id) {
    try {
      const { data, error } = await supabase
        .from('onboarding')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
      throw error;
    }
  }

  /**
   * Get all onboarding records
   * @returns {Promise<Array>} - Array of onboarding data
   */
  async getAllOnboarding() {
    try {
      const { data, error } = await supabase
        .from('onboarding')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(`Database error: ${error.message}`);
      }

      return data;
    } catch (error) {
      console.error('Error fetching onboarding data:', error);
      throw error;
    }
  }
}

module.exports = new OnboardingService(); 