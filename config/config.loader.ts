import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

export interface ConfigInterface {
  server_name: string;
  server_endpoints: {
    auth: string;
  };
}

export class ConfigLoader {
  private static instance: ConfigLoader;
  private config: ConfigInterface;

  private constructor() {
    this.loadConfig();
  }

  public static getInstance(): ConfigLoader {
    if (!ConfigLoader.instance) {
      ConfigLoader.instance = new ConfigLoader();
    }
    return ConfigLoader.instance;
  }

  private loadConfig(): void {
    const env = process.env.ENV || 'local';
    const configPath = path.join(process.cwd(), 'config', `config_${env}.yml`);

    if (!fs.existsSync(configPath)) {
      throw new Error(`Config file not found: ${configPath}`);
    }

    try {
      const fileContents = fs.readFileSync(configPath, 'utf8');
      this.config = yaml.load(fileContents) as ConfigInterface;
      console.debug('Loaded config:', JSON.stringify(this.config, null, 2));
    } catch (error) {
      throw new Error(`Failed to parse config file: ${error.message}`);
    }
  }

  public getConfig(): ConfigInterface {
    return this.config;
  }

  public get<K extends keyof ConfigInterface>(key: K): ConfigInterface[K] {
    return this.config[key];
  }
}

// Export singleton instance
export const config = ConfigLoader.getInstance();