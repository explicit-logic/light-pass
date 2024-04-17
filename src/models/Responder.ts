class Responder implements Partial<ResponderInterface> {
  #id: string;
  #quizId: number;
  #agent: string;
  #identified = false;
  #email?: string;
  #name?: string;
  #theme: ThemeMode;
  #timeZone: string;
  #group?: string;
  #answer?: object;

  constructor(params: {
    id: string;
    quizId: number;
    agent: string;
    timeZone: string;
    theme: ThemeMode;
  }) {
    const { id, quizId, agent, timeZone, theme } = params;

    this.#id = id;
    this.#quizId = quizId;
    this.#agent = agent;
    this.#timeZone = timeZone;
    this.#theme = theme;
  }

  identify({
    email,
    name,
    group,
  }: {
    email: string;
    name?: string;
    group?: string;
  }) {
    this.#identified = true;
    this.#email = email;
    this.#name = name;
    this.#group = group;
  }

  setAnswer(answer: object) {
    this.#answer = answer;
  }

  get id() {
    return this.#id;
  }

  get quizId() {
    return this.#quizId;
  }

  get agent() {
    return this.#agent;
  }

  get email() {
    return this.#email;
  }

  get identified() {
    return this.#identified;
  }

  get name() {
    return this.#name;
  }

  get theme() {
    return this.#theme;
  }

  get timeZone() {
    return this.#timeZone;
  }

  get group() {
    return this.#group;
  }

  get answer() {
    return this.#answer;
  }
}

export default Responder;
