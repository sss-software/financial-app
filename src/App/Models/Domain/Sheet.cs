﻿namespace App.Models.Domain {
    using System;
    using System.Collections.Generic;
    using System.Collections.ObjectModel;
    using System.ComponentModel.DataAnnotations;
    using Repositories;

    /// <summary>
    /// Represents a sheet of months expenses
    /// </summary>
    [GenerateRepository]
    public class Sheet : IAppOwnerEntity, IHasId {
        private ICollection<SheetEntry> _entries;
        public int Id { get; set; }

        /// <summary>
        /// Custom name, if set
        /// </summary>
        [StringLength(250)]
        public string Name { get; set; }

        public DateTime Subject { get; set; }

        public DateTime UpdateTimestamp { get; set; }

        public DateTime CreateTimestamp { get; set; }

        [Required]
        [GenerateRepositoryQuery(IsMultiple = true)]
        public virtual AppOwner Owner { get; set; }

        public virtual ICollection<SheetEntry> Entries {
            get { return this._entries ?? (this._entries = new Collection<SheetEntry>()); }
            set { this._entries = value; }
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="T:System.Object"/> class.
        /// </summary>
        public Sheet() {
            this.CreateTimestamp = DateTime.Now;
            this.UpdateTimestamp = DateTime.Now;
        }
    }
}